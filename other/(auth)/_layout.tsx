import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthLayout() {
  const { isLoggedIn, isReady } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     router.replace("/(tabs)/diary");
  //   }
  // }, [isLoggedIn]);
  //
  // if (!isReady) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
