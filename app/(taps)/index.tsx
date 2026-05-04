import HomeSchudule from "@/compunents/HomeSchudule";
import ListHeading from "@/compunents/ListHeading";
import Tasks from "@/compunents/Tasks";
import { CLASSES, HOME_USER, TASKS } from "@/constatns/data";
import "@/global.css";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { useFocusEffect, useRouter } from "expo-router";
import { styled } from "nativewind";
import { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView as URSafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
// import * as Notifications from 'expo-notifications';

const SafeAreaView = styled(URSafeAreaView);


// async function sendNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Hello 👋",
//       body: "This is your notification!",
//     },
//     trigger: null, // shows immediately
//   });
// }
export default function App() {
  const { user } = useUser();
  const router = useRouter();
  const displayName = user?.username ?? user?.firstName ?? HOME_USER.name;
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh data when page comes into focus
  useFocusEffect(
    useCallback(() => {
      // Force component to re-render by updating refresh key
      setRefreshKey((prev) => prev + 1);
    }, []),
  );

  return (
    
    <SafeAreaView className="flex-1 bg-background p-5">
      <StatusBar style="dark" />
      <View>
        <FlatList
          key={`tasks-${refreshKey}`}
          data={TASKS}
          ListHeaderComponent={() => (
            <>
              <View className="flex-row items-center space-x-2 mb-6">
                <Text className="test1">Hello </Text>
                <Text className="test mr-2">{displayName} 👋</Text>
                <Text className="mt-4">{dayjs().format("hh:mm A")}</Text>
              </View>

              <View>
                <ListHeading title="Up Coming Classes" />

                <FlatList
                  key={`classes-${refreshKey}`}
                  data={CLASSES}
                  renderItem={({ item }) => <HomeSchudule {...item} />}
                  keyExtractor={(item) => item.date}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ListEmptyComponent={<Text>No Upcoming Class Today</Text>}
                  contentContainerClassName=""
                />
              </View>

              <View className="m-6" />
  
              <ListHeading title="Tasks" />
            </>
          )}
          renderItem={({ item }) => <Tasks {...item} />}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.name}
          ListEmptyComponent={<Text>No Tasks for Now</Text>}
          ItemSeparatorComponent={() => <View className="h-2" />}
          contentContainerClassName="pb-30"
        />
      </View>
    </SafeAreaView>
  );
}
