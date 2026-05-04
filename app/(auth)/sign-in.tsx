import "@/global.css";
import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView as URSafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const SafeAreaView = styled(URSafeAreaView);

export default function SignInPage() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleSubmit = async () => {
    const { error } = await signIn.password({
      identifier,
      password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "needs_client_trust") {
      await signIn.mfa.sendEmailCode();
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize();
      router.push("/");
    }
  };

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize();
      router.push("/");
    }
  };

  return (
    <SafeAreaView className="auth-screen">
      <StatusBar style="dark" />
      <View className="auth-content">
        <Text className="auth-title m-5">Welcom Back</Text>
        <View className="auth-card">
          {signIn.status === "needs_client_trust" ? (
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
                onPress={() => signIn.mfa.sendEmailCode()}
              >
                <Text className="auth-secondary-button-text">
                  I need a new code
                </Text>
              </Pressable>
              <Pressable
                className="auth-secondary-button"
                onPress={() => signIn.reset()}
              >
                <Text className="auth-secondary-button-text">Start over</Text>
              </Pressable>
            </View>
          ) : (
            <View className="auth-form">
              <Text className="auth-title mb-5">Sign in</Text>
              <View className="auth-field">
                <TextInput
                  className="auth-input"
                  autoCapitalize="none"
                  value={identifier}
                  placeholder="Enter email or username"
                  placeholderTextColor="#666666"
                  onChangeText={setIdentifier}
                  keyboardType="default"
                />
                {errors.fields.identifier && (
                  <Text className="auth-error">
                    {errors.fields.identifier.message}
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
                  !identifier || !password || fetchStatus === "fetching"
                    ? "auth-button-disabled"
                    : ""
                }`}
                onPress={handleSubmit}
                disabled={
                  !identifier || !password || fetchStatus === "fetching"
                }
              >
                <Text className="auth-button-text">Continue</Text>
              </Pressable>
              <View className="auth-link-row">
                <Text className="auth-link-copy">
                  Don't have an account?
                </Text>
                <Link href="/(auth)/sign-up">
                  <Text className="auth-link">Sign up</Text>
                </Link>
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
