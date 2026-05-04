import "@/global.css";
import { useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView as URSafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const SafeAreaView = styled(URSafeAreaView);

export default function SignUpPage() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleSubmit = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password,
      username,
      firstName: username,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signUp.status === "missing_requirements") {
      await signUp.verifications.sendEmailCode();
    }

    if (signUp.status === "complete") {
      await signUp.finalize();
      router.push("/");
    }
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      await signUp.finalize();
      router.push("/");
    }
  };

  const needsVerification =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  return (
    <SafeAreaView className="auth-screen">
      <StatusBar style="dark" />
      <View className="auth-content">
        <View className="auth-card">
          {needsVerification ? (
            <View className="auth-form">
              <Text className="auth-title">Verify your account</Text>
              <View className="auth-field">
                <TextInput
                  className="auth-input"
                  value={code}
                  placeholder="Enter your verification code"
                  placeholderTextColor="#666666"
                  onChangeText={setCode}
                  keyboardType="numeric"
                />
                {errors.fields.code && (
                  <Text className="auth-error">
                    {errors.fields.code.message}
                  </Text>
                )}
              </View>
              <Pressable
                className={`auth-button ${
                  fetchStatus === "fetching" ? "auth-button-disabled" : ""
                }`}
                onPress={handleVerify}
                disabled={fetchStatus === "fetching"}
              >
                <Text className="auth-button-text">Verify</Text>
              </Pressable>
              <Pressable
                className="auth-secondary-button"
                onPress={() => signUp.verifications.sendEmailCode()}
              >
                <Text className="auth-secondary-button-text">
                  I need a new code
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="auth-form">
              <Text className="auth-title mb-5">Sign up</Text>
              <View className="auth-field">
                <Text className="auth-label">Username</Text>
                <TextInput
                  className="auth-input"
                  autoCapitalize="none"
                  value={username}
                  placeholder="Enter username"
                  placeholderTextColor="#666666"
                  onChangeText={setUsername}
                />
                {errors.fields.username && (
                  <Text className="auth-error">
                    {errors.fields.username.message}
                  </Text>
                )}
              </View>
              <View className="auth-field">
                <Text className="auth-label">Email address</Text>
                <TextInput
                  className="auth-input"
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Enter email"
                  placeholderTextColor="#666666"
                  onChangeText={setEmailAddress}
                  keyboardType="email-address"
                />
                {errors.fields.emailAddress && (
                  <Text className="auth-error">
                    {errors.fields.emailAddress.message}
                  </Text>
                )}
              </View>
              <View className="auth-field">
                <Text className="auth-label">Password</Text>
                <TextInput
                  className="auth-input"
                  value={password}
                  placeholder="Enter password"
                  placeholderTextColor="#666666"
                  secureTextEntry
                  onChangeText={setPassword}
                />
                {errors.fields.password && (
                  <Text className="auth-error">
                    {errors.fields.password.message}
                  </Text>
                )}
              </View>
              <Pressable
                className={`auth-button ${
                  !username ||
                  !emailAddress ||
                  !password ||
                  fetchStatus === "fetching"
                    ? "auth-button-disabled"
                    : ""
                }`}
                onPress={handleSubmit}
                disabled={
                  !username ||
                  !emailAddress ||
                  !password ||
                  fetchStatus === "fetching"
                }
              >
                <Text className="auth-button-text">Sign up</Text>
              </Pressable>
              <View className="auth-link-row">
                <Text className="auth-link-copy">Already have an account?</Text>
                <Link href="/(auth)/sign-in">
                  <Text className="auth-link">Sign in</Text>
                </Link>
              </View>
              <View nativeID="clerk-captcha" />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
