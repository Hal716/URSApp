import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { pingAppwrite } from "@/lib/appwrite";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    pingAppwrite();
  }, []);

  if (!isLoaded) {
    return null;
  }

  return <Redirect href={isSignedIn ? "/(taps)" : "/(auth)/sign-in"} />;
}