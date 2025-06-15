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
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { apiRequest } from "@/utils";
import uuid from "react-native-uuid";
import i18n from "i18next";
import { LocaleConfig } from "react-native-calendars";
import { store } from "@/store";
import { Provider } from "react-redux";
import SelectPlanModal from "@/components/SelectPlanModal";
import { Plan, User } from "@/types";
import Logo from "@/components/Logo";
// import * as SecureStore from "expo-secure-store";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // const clearUserFromSecureStore = async () => {
    //   await SecureStore.deleteItemAsync("token");
    //   await SecureStore.deleteItemAsync("user");
    //   return;
    // };
    // clearUserFromSecureStore();

    const initUser = async () => {
      let storedUser = await SecureStore.getItemAsync("user");
      let userObj: User | null = storedUser ? JSON.parse(storedUser) : null;
      if (!userObj) {
        const newUuid = uuid.v4();

        const res = await apiRequest({
          url: `/users/create-by-uuid`,
          method: "POST",
          data: { uuid: newUuid },
        });

        const data = await res.data;

        userObj = data.user;
        await SecureStore.setItemAsync("token", data.accessToken);
        await SecureStore.setItemAsync("user", JSON.stringify(data.user));
      }

      setUser(userObj);
    };
    initUser();
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

  const subscribePlan = async (plan: Plan) => {
    try {
      const { name, price, tokensLimit, ...rest } = plan;
      const res = await apiRequest({
        url: `/plans/subscribe`,
        method: "POST",
        data: {
          name,
          price,
          tokensLimit,
        },
      });
      const storedUser = await SecureStore.getItemAsync("user");
      const userObj = JSON.parse(storedUser!);

      userObj.plan = res.data;
      setUser(userObj);
      await SecureStore.setItemAsync("user", JSON.stringify(userObj));
    } catch (error) {
      console.error("Error setting plan:", error);
    }
  };

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProviderCustom>
        <AuthProvider>
          {!user?.plan ? (
            <SelectPlanModal visible onSelect={subscribePlan} />
          ) : (
            <>
              <RootLayoutInner />
            </>
          )}
        </AuthProvider>
      </ThemeProviderCustom>
    </Provider>
  );
}

function RootLayoutInner() {
  const colorScheme = useColorScheme();
  const navTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  const barStyle = colorScheme === "dark" ? "light" : "dark";

  return (
    <ThemeProvider value={navTheme}>
      {/*<Logo />*/}
      <Stack screenOptions={{ headerShown: false }}></Stack>
      <StatusBar style={barStyle} translucent />
    </ThemeProvider>
  );
}
