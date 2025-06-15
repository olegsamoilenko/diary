import React, { forwardRef } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useThemeCustom } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { THEME_OPTIONS } from "@/constants/ThemeOptions";
import SideSheet, { SideSheetRef } from "@/components/SideSheet";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const ThemeSwitcher = forwardRef<SideSheetRef, {}>((props, ref) => {
  const { theme, setTheme } = useThemeCustom();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  return (
    <SideSheet ref={ref}>
      <View style={styles.container}>
        {THEME_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.row}
            onPress={() => setTheme(option.value as any)}
          >
            <View
              style={[
                styles.radio,
                theme === option.value && {
                  borderColor: Colors[colorScheme].radioSelectedBorder,
                  backgroundColor: Colors[colorScheme].radioSelectedBackground,
                },
                {
                  borderColor: Colors[colorScheme].radioBorder,
                  backgroundColor: Colors[colorScheme].radioBackground,
                },
              ]}
            >
              {theme === option.value && (
                <View
                  style={[
                    styles.radioDot,
                    { backgroundColor: Colors[colorScheme].radioSelectedDot },
                  ]}
                />
              )}
            </View>
            <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
              {t(`settings.theme.${option.key}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SideSheet>
  );
});

ThemeSwitcher.displayName = "ThemeSwitcher";
export default ThemeSwitcher;

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    gap: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: "#0284c7",
  },
  label: {
    fontSize: 16,
    color: "#18181b",
  },
});
