import { TASKS } from "@/constatns/data";
import "@/global.css";
import { saveTaskToAppwrite, updateTaskRowInAppwrite } from "@/lib/appwrite";
import { saveTasks } from "@/lib/utility";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { styled } from "nativewind";
import { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView as URSafeAreaView } from "react-native-safe-area-context";


const SafeAreaView = styled(URSafeAreaView);
const priorityOptions: Array<"Low" | "Medium" | "High"> = [
  "Low",
  "Medium",
  "High",
];
const defaultTaskColor = "#f5c542";

export default function Addtask() {
  const router = useRouter();
  const { user } = useUser();
  const { index } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [dueDate, setDueDate] = useState("");
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Load task data if editing
  useEffect(() => {
    if (index !== undefined) {
      const taskIndex = Number(index);
      if (!isNaN(taskIndex) && TASKS[taskIndex]) {
        const item = TASKS[taskIndex];
        const itemDate = dayjs(item.dueDate);
        setName(item.name);
        setSubject(item.subject);
        setPriority(item.priority);
        setDueDate(itemDate.format("YYYY-MM-DD"));
        const itemHour = itemDate.hour();
        setPeriod(itemHour >= 12 ? "PM" : "AM");
        setHour(itemHour % 12 === 0 ? 12 : itemHour % 12);
        setMinute(itemDate.minute().toString().padStart(2, "0"));
        setEditingIndex(taskIndex);
      }
    }
  }, [index]);

  const resetForm = () => {
    setName("");
    setSubject("");
    setPriority("Medium");
    setDueDate("");
    setHour(8);
    setMinute("00");
    setPeriod("AM");
    setEditingIndex(null);
  };

  const buildDueDateISO = () => {
    if (!dueDate.trim()) return "";
    const parsedDate = dayjs(dueDate.trim());
    if (!parsedDate.isValid()) return "";
    const rawHour = Number(hour);
    const rawMinute = Number(minute);
    const safeHour = isNaN(rawHour) ? 8 : Math.min(Math.max(rawHour, 1), 12);
    const safeMinute = isNaN(rawMinute)
      ? 0
      : Math.min(Math.max(rawMinute, 0), 59);
    const selectedHour = period === "AM" ? safeHour % 12 : (safeHour % 12) + 12;
    const target = parsedDate
      .hour(selectedHour)
      .minute(safeMinute)
      .second(0);
    return target.isValid() ? target.toISOString() : "";
  };

  const handleSave = async () => {
    if (!name.trim() || !subject.trim() || !dueDate.trim()) {
      Alert.alert(
        "Missing information",
        "Please fill out all fields before saving.",
      );
      return;
    }

    const builtDate = buildDueDateISO();
    if (!builtDate) {
      Alert.alert("Invalid date", "Please enter a valid due date.");
      return;
    }

    const existingColor =
      editingIndex !== null ? TASKS[editingIndex]?.color : undefined;
    const newTask: Tasks = {
      name: name.trim(),
      subject: subject.trim(),
      priority: priority,
      dueDate: builtDate,
      color: existingColor ?? defaultTaskColor,
    };

    if (!user?.id) {
      Alert.alert("Authentication required", "Please sign in again.");
      return;
    }

    try {
      const previousAppwriteRowId =
        editingIndex !== null ? TASKS[editingIndex]?.appwriteRowId : undefined;

      if (editingIndex !== null) {
        TASKS[editingIndex] = newTask;
      } else {
        TASKS.push(newTask);
      }

      const localSaved = await saveTasks(TASKS, user.id);
      if (!localSaved) {
        throw new Error("Could not save tasks locally.");
      }

      const taskIndex = editingIndex !== null ? editingIndex : TASKS.length - 1;

      if (previousAppwriteRowId) {
        await updateTaskRowInAppwrite({
          rowId: previousAppwriteRowId,
          name: newTask.name,
          subject: newTask.subject,
          dueDate: newTask.dueDate,
          priority: newTask.priority,
          color: newTask.color,
          userId: user.id,
        });
        TASKS[taskIndex] = {
          ...newTask,
          appwriteRowId: previousAppwriteRowId,
        };
      } else {
        const row = await saveTaskToAppwrite({
          name: newTask.name,
          subject: newTask.subject,
          dueDate: newTask.dueDate,
          priority: newTask.priority,
          color: newTask.color,
          userId: user.id,
        });
        TASKS[taskIndex] = { ...newTask, appwriteRowId: row.$id };
      }

      await saveTasks(TASKS, user.id);

      Alert.alert(
        "Success",
        editingIndex !== null
          ? "Task updated and synced to Appwrite."
          : "Task added and synced to Appwrite.",
      );
      resetForm();
      router.back();
    } catch (error) {
      console.error("Failed to save task:", error);
      Alert.alert(
        "Save failed",
        "Task could not be synced to Appwrite. Please verify your database and table IDs in .env.",
      );
    }
  };

  const handleCancel = () => {
    resetForm();
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <ScrollView contentContainerClassName="pb-20">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-3xl font-Coopbl text-primary">
            {editingIndex !== null ? "Edit task" : "Add Task"}
          </Text>
          <Pressable onPress={handleCancel}>
            <Text className="text-lg text-primary">✕</Text>
          </Pressable>
        </View>

        <View className="auth-card mb-6">
          <Text className="auth-helper mb-4">
            Create a new task with priority level and due date.
          </Text>

          <View className="auth-field">
            <Text className="auth-label">Task name</Text>
            <TextInput
              className="auth-input"
              placeholder="e.g. Physics Homework"
              placeholderTextColor="#666666"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View className="auth-field">
            <Text className="auth-label">Subject</Text>
            <TextInput
              className="auth-input"
              placeholder="e.g. Physics"
              placeholderTextColor="#666666"
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          <View className="auth-field">
            <Text className="auth-label">Priority</Text>
            <View className="flex-row gap-2">
              {priorityOptions.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setPriority(option)}
                  className={`rounded-2xl px-4 py-2 border ${
                    priority === option
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card"
                  }`}
                >
                  <Text
                    className={`text-sm font-sans-semibold ${priority === option ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="auth-field">
            <Text className="auth-label">Due date</Text>
            <TextInput
              className="auth-input"
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#666666"
              value={dueDate}
              onChangeText={setDueDate}
            />
          </View>

          <View className="auth-field">
            <Text className="auth-label">Time</Text>
            <View className="flex-row items-start gap-2">
              <View className="flex-1">
                <Text className="auth-label mb-2">Hour</Text>
                <TextInput
                  className="auth-input"
                  placeholder="HH"
                  placeholderTextColor="#666666"
                  keyboardType="number-pad"
                  maxLength={2}
                  value={hour.toString()}
                  onChangeText={(value) => {
                    const numeric = Number(value.replace(/[^0-9]/g, ""));
                    setHour(isNaN(numeric) ? 0 : numeric);
                  }}
                />
              </View>

              <View className="flex-1">
                <Text className="auth-label mb-2">Minute</Text>
                <TextInput
                  className="auth-input"
                  placeholder="MM"
                  placeholderTextColor="#666666"
                  keyboardType="number-pad"
                  maxLength={2}
                  value={minute}
                  onChangeText={(value) => {
                    const numeric = value.replace(/[^0-9]/g, "");
                    setMinute(numeric.slice(0, 2));
                  }}
                />
              </View>
            </View>
            <View className="flex-row gap-2 mt-3">
              {(["AM", "PM"] as const).map((periodValue) => (
                <Pressable
                  key={periodValue}
                  onPress={() => setPeriod(periodValue)}
                  className={`rounded-2xl px-4 py-2 border ${
                    period === periodValue
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card"
                  }`}
                >
                  <Text
                    className={`text-sm ${period === periodValue ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {periodValue}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable className="auth-button mt-6" onPress={handleSave}>
            <Text className="auth-button-text">
              {editingIndex !== null ? "Save changes" : "Add task"}
            </Text>
          </Pressable>

          <Pressable
            className="auth-secondary-button mt-3"
            onPress={handleCancel}
          >
            <Text className="auth-secondary-button-text">Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
