import { CLASSES } from "@/constatns/data";
import "@/global.css";
import { deleteClassRowFromAppwrite } from "@/lib/appwrite";
import { saveClasses } from "@/lib/utility";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as URSafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

const SafeAreaView = styled(URSafeAreaView);

export default function AllClasses() {
  const [classes, setClasses] = useState(CLASSES);
  const router = useRouter();
  const { user } = useUser();

  const handleEdit = (index: number) => {
    router.push(`/add-class?index=${index}`);
  };

  const handleDelete = async (index: number) => {
    Alert.alert("Delete Class", "Are you sure you want to delete this class?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const rowId = classes[index]?.appwriteRowId;
          try {
            if (rowId) {
              await deleteClassRowFromAppwrite(rowId);
            }
          } catch (e) {
            console.error(e);
            Alert.alert(
              "Delete failed",
              "Could not delete this class from Appwrite. Check your connection and try again.",
            );
            return;
          }
          const updatedClasses = classes.filter((_, i) => i !== index);
          setClasses(updatedClasses);
          CLASSES.splice(0, CLASSES.length, ...updatedClasses);
          await saveClasses(updatedClasses, user!.id);
        },
      },
    ]);
  };

  const sortedClasses = [...classes].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="pb-24 pt-5 px-5">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-3xl font-Coopbl text-primary">All Classes</Text>
          <Pressable onPress={() => router.back()}>
            <Text className="text-lg text-primary">✕</Text>
          </Pressable>
        </View>

        {sortedClasses.length > 0 ? (
          sortedClasses.map((item) => {
            const originalIndex = classes.findIndex(
              (cls) => cls.name === item.name && cls.date === item.date
            );
            return (
            <View
              key={`${item.name}-${originalIndex}`}
              className="auth-card mb-3 rounded-3xl p-4 flex-row items-center justify-between"
              style={{ backgroundColor: item.color ?? "#fff" }}
            >
              <View className="flex-1">
                <Text className="text-lg font-Coopbl text-subprimary mb-1">
                  {item.name}
                </Text>
                <Text className="auth-helper">{item.instructor}</Text>
                <Text className="auth-helper">{item.classroom}</Text>
                <Text className="text-sm font-sans-medium text-muted-foreground mt-2">
                  {dayjs(item.date).format("dddd, MMM D • hh:mm A")}
                </Text>
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
            <Text className="auth-helper text-center">
              No classes added yet
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
