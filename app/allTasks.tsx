import { TASKS } from "@/constatns/data";
import "@/global.css";
import { deleteTaskRowFromAppwrite } from "@/lib/appwrite";
import { saveTasks } from "@/lib/utility";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as URSafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

const SafeAreaView = styled(URSafeAreaView);

export default function AllTasks() {
  const [tasks, setTasks] = useState(TASKS);
  const router = useRouter();
  const { user } = useUser();


  const handleEdit = (index: number) => {
    router.push(`/add-task?index=${index}`);
  };

  const handleDelete = async (index: number) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const rowId = tasks[index]?.appwriteRowId;
          try {
            if (rowId) {
              await deleteTaskRowFromAppwrite(rowId);
            }
          } catch (e) {
            console.error(e);
            Alert.alert(
              "Delete failed",
              "Could not delete this task from Appwrite. Check your connection and try again.",
            );
            return;
          }
          const updatedTasks = tasks.filter((_, i) => i !== index);
          setTasks(updatedTasks);
          TASKS.splice(0, TASKS.length, ...updatedTasks);
          await saveTasks(updatedTasks, user!.id);
        },
      },
    ]);
  };

  const getPriorityColor = (priority: "Low" | "Medium" | "High") => {
    switch (priority) {
      case "High":
        return "#ff4444";
      case "Medium":
        return "#ffaa00";
      case "Low":
        return "#44aa44";
      default:
        return "#cccccc";
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="pb-24 pt-5 px-5">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-3xl font-Coopbl text-primary">All Tasks</Text>
          <Pressable onPress={() => router.back()}>
            <Text className="text-lg text-primary">✕</Text>
          </Pressable>
        </View>

        {sortedTasks.length > 0 ? (
          sortedTasks.map((item) => {
            const originalIndex = tasks.findIndex(
              (t) => t.name === item.name && t.dueDate === item.dueDate
            );
            return (
            <View
              key={`${item.name}-${originalIndex}`}
              className="auth-card mb-3 rounded-3xl p-4 flex-row items-center justify-between"
              style={{
                borderLeftWidth: 4,
                borderLeftColor: getPriorityColor(item.priority),
              }}
            >
              <View className="flex-1">
                <Text className="text-lg font-Coopbl text-subprimary mb-1">
                  {item.name}
                </Text>
                <Text className="auth-helper">{item.subject}</Text>
                <View className="flex-row items-center gap-2 mt-2">
                  <Text
                    className="px-2 py-1 rounded text-xs font-sans-bold"
                    style={{
                      backgroundColor: getPriorityColor(item.priority),
                    }}
                  >
                    {item.priority}
                  </Text>
                  <Text className="text-sm font-sans-medium text-muted-foreground">
                    {dayjs(item.dueDate).format("MMM D • hh:mm A")}
                  </Text>
                </View>
              </View>
              <View className="flex-col items-end gap-2">
                <Pressable
                  className="auth-secondary-button"
                  onPress={() => handleEdit(originalIndex)}
                >
                  <Text className="auth-secondary-button-text">Edit</Text>
                </Pressable>
                <Pressable
                  className="auth-secondary-button bg-red-500"
                  onPress={() => handleDelete(originalIndex)}
                >
                  <Text className="auth-secondary-button-text">Delete</Text>
                </Pressable>
              </View>
            </View>
            );})
        ) : (
          <View className="rounded-3xl border border-border bg-card p-4">
            <Text className="auth-helper text-center">No tasks added yet</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
