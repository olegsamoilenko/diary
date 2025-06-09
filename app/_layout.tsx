import "../i18n";
import "@/constants/CalendarLocale";
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
import i18n from "i18next";
import { LocaleConfig } from "react-native-calendars";
import { store } from "@/store";
import { Provider } from "react-redux";
// import * as SecureStore from "expo-secure-store";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const initUuid = async () => {
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

  useEffect(() => {
    const initLanguage = async () => {
      const lang = await SecureStore.getItemAsync("lang");
      if (lang) {
        i18n.changeLanguage(lang);
        LocaleConfig.defaultLocale = lang;
      }
    };

    initLanguage();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProviderCustom>
        <AuthProvider>
          <RootLayoutInner />
        </AuthProvider>
      </ThemeProviderCustom>
    </Provider>
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
