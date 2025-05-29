import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useTranslation } from "react-i18next";
import { useThemeCustom } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import i18n from "i18next";
import { useRef, useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { SideSheetRef } from "@/components/SideSheet";
import ThemeSwitcher from "@/components/settings/ThemeSwitcher";
import LanguageSwitcher from "@/components/settings/LanguageSwitcher";

export default function Settings() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const { theme } = useThemeCustom();
  const themeSwitcherRef = useRef<SideSheetRef>(null);
  const languageSwitcherRef = useRef<SideSheetRef>(null);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme].statusBarBg,
      }}
      edges={["top"]}
    >
      <ParallaxScrollView>
        <ThemedText type="title">{t("settings")}</ThemedText>
        <TouchableOpacity
          onPress={() => {
            themeSwitcherRef.current?.open();
          }}
        >
          <ThemedView
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <ThemedText>{t("theme.title")}</ThemedText>
            <ThemedText>{t(`theme.${theme}`)}</ThemedText>
          </ThemedView>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            languageSwitcherRef.current?.open();
          }}
        >
          <ThemedView
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <ThemedText>{t("languages.title")}</ThemedText>
            <ThemedText>{t(`languages.${i18n.language}`)}</ThemedText>
          </ThemedView>
        </TouchableOpacity>

        {/*<ThemedView>*/}
        {/*  <ThemedText type="subtitle">{t("languages.title")}</ThemedText>*/}
        {/*</ThemedView>*/}
      </ParallaxScrollView>
      <ThemeSwitcher ref={themeSwitcherRef} />
      <LanguageSwitcher ref={languageSwitcherRef} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
