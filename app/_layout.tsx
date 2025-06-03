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
// import * as SecureStore from "expo-secure-store";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

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

  return (
    <ThemeProvider value={navTheme}>
      <Stack screenOptions={{ headerShown: false }}></Stack>
      <StatusBar style={barStyle} translucent />
    </ThemeProvider>
  );
}
