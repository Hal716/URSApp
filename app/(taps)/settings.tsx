import { HOME_USER } from "@/constatns/data";
import "@/global.css";
import { useAuth, useUser } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import { Alert, Image, Pressable, Switch, Text, View } from "react-native";
import { SafeAreaView as URSafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const SafeAreaView = styled(URSafeAreaView);


export default function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const displayName = user?.username ?? user?.firstName ?? "Guest";
  const emailAddress =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "Not available";

  const handleEditUsername = async () => {
    let newUsername = "";
    Alert.prompt(
      "Change Username",
      "Enter your new username:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Update",
          onPress: async () => {
            if (newUsername.trim().length === 0) {
              Alert.alert("Error", "Username cannot be empty.");
              return;
            }

            try {
              await user?.update({
                username: newUsername.trim(),
              });
              HOME_USER.name = newUsername.trim();
              Alert.alert("Success", "Username updated successfully.");
            } catch (error) {
              Alert.alert("Error", "Failed to update username.");
              console.error(error);
            }
          },
        },
      ],
      "plain-text",
      displayName,
    );
  };

  return (
    <SafeAreaView
      className="bg-background flex-1"
    >
      <StatusBar style="dark" />
      <View className="auth-card">
        {user ? (
          <>
            <View className="items-center mb-6 auth-field">
              {user.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  className="w-24 h-24 rounded-full"
                ></Image>
              ) : (
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">
                    {displayName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            <View className="auth-field">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="auth-label">Name</Text>
                  <Text className="auth-helper">{displayName}</Text>
                </View>
                <Pressable onPress={handleEditUsername} className="ml-3 ">
                  <Image
                    source={require("@/assets/icons/edit.png")}
                    className="w-6 h-6"
                  />
                </Pressable>
              </View>
            </View>
            <View className="auth-field">

            </View>
            <View className="auth-field">
              <Text className="auth-label mt-5">Email</Text>
              <Text className="auth-helper mb-5">{emailAddress}</Text>
            </View>
            <Pressable
              className="auth-button "
              onPress={() =>
                Alert.alert("Sign Out", "Are you sure you want to sign out?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: async () => {
                      await signOut();
                      router.replace("/(auth)/sign-in");
                    },
                  },
                ])
              }
            >
              <Text className="auth-button-text">Sign Out</Text>
            </Pressable>
          </>
        ) : (
          <View className="auth-form">
            <Text className="auth-title">No account signed in</Text>
            <Text className="auth-helper mt-2">
              Please sign in to view account details.
            </Text>
            <Pressable
              className="auth-secondary-button mt-4"
              onPress={() => {
                /* navigation handled by Link below */
              }}
            >
              <Link href="/(auth)/sign-in">
                <Text className="auth-secondary-button-text">
                  Go to Sign In
                </Text>
              </Link>
            </Pressable>
          </View>
        )}
      </View>

      <View className="mt-6 items-center">
        <Link href="/" className="auth-link">
          <Text className="auth-link">Go Back</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}
