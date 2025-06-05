import React, { forwardRef, useCallback, useState } from "react";
import SideSheet, { SideSheetRef } from "@/components/SideSheet";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME_OPTIONS } from "@/constants/ThemeOptions";
import { Colors } from "@/constants/Colors";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme";

const LanguageSwitcher = forwardRef<SideSheetRef, {}>((props, ref) => {
  const [lang, setLang] = useState<string | null>(i18n.language);
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  const languages = Object.keys(i18n.options.resources ?? { en: {} }).map(
    (lang) => ({
      key: lang,
      value: lang,
    }),
  );

  console.log("Available languages:", languages);

  const setValue = useCallback(
    (valOrFn: string | ((prev: string | null) => string | null)) => {
      const value = typeof valOrFn === "function" ? valOrFn(lang) : valOrFn;
      if (value) {
        i18n.changeLanguage(value);
        setLang(value);
      }
    },
    [lang],
  );

  return (
    <SideSheet ref={ref}>
      <View style={styles.container}>
        {languages.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.row}
            onPress={() => setValue(option.value as any)}
          >
            <View
              style={[
                styles.radio,
                lang === option.value && {
                  borderColor: Colors[colorScheme].radioSelectedBorder,
                  backgroundColor: Colors[colorScheme].radioSelectedBackground,
                },
                {
                  borderColor: Colors[colorScheme].radioBorder,
                  backgroundColor: Colors[colorScheme].radioBackground,
                },
              ]}
            >
              {lang === option.value && (
                <View
                  style={[
                    styles.radioDot,
                    { backgroundColor: Colors[colorScheme].radioSelectedDot },
                  ]}
                />
              )}
            </View>
            <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
              {t(`languages.${option.key}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SideSheet>
  );
});

LanguageSwitcher.displayName = "LanguageSwitcher";

export default LanguageSwitcher;

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
