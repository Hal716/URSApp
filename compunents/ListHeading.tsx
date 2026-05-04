import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const ListHeading = ({ title }: ListHeadingProps) => {
  const handleViewAll = () => {
    if (title === "Up Coming Classes") {
      router.push("/allClasses");
    }
    if (title === "Tasks") {
      router.push("/allTasks");
    }
  };

  return (
    <View className="list-head">
      <Text className="list-title">{title}</Text>

      <Pressable className="list-action" onPress={handleViewAll}>
        <Text className="list-action-text">View All</Text>
      </Pressable>
    </View>
  );
};

export default ListHeading;
