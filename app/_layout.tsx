import "../i18n";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemeProviderCustom } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { apiRequest } from "@/utils";
import uuid from "react-native-uuid";
// import * as SecureStore from "expo-secure-store";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const initUuid = async () => {
      console.log("Initializing UUID and Token...");
      const existingUUID = await SecureStore.getItemAsync("uuid");
      if (!existingUUID) {
        const newUuid = uuid.v4();

        const res = await apiRequest({
          url: `/users/create-by-uuid`,
          method: "POST",
          data: {
            uuid: newUuid,
          },
        });

        const data = await res.data;

        await SecureStore.setItemAsync("token", data.accessToken);
        await SecureStore.setItemAsync("uuid", data.user.uuid);
      }
    };
    initUuid();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProviderCustom>
      <AuthProvider>
        <RootLayoutInner />
      </AuthProvider>
    </ThemeProviderCustom>
  );
}

function RootLayoutInner() {
  const colorScheme = useColorScheme();
  const navTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  const barStyle = colorScheme === "dark" ? "light" : "dark";

  // SecureStore.deleteItemAsync("token");
  // SecureStore.deleteItemAsync("uuid");

  return (
    <ThemeProvider value={navTheme}>
      <Stack screenOptions={{ headerShown: false }}></Stack>
      <StatusBar style={barStyle} translucent />
    </ThemeProvider>
  );
}
