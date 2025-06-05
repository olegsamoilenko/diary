import React, { forwardRef, useState } from "react";
import SideSheet, { SideSheetRef } from "@/components/SideSheet";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { ColorTheme } from "@/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { MoodEmoji } from "@/constants/Mood";
import { apiRequest } from "@/utils";

const AddNewEntry = forwardRef<SideSheetRef, {}>((props, ref) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);
  const [loading, setLoading] = useState(false);

  const [mood, setMood] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSave = async () => {
    setLoading(true);

    try {
      const res = await apiRequest({
        url: `/diary-entries/create`,
        method: "POST",
        data: {
          title,
          content,
          mood,
        },
      });

      const entry = res.data;

      setLoading(false);
    } catch (err) {
      console.log("Error saving entry.ts:", err);
      setLoading(false);
    }
  };

  return (
    <SideSheet ref={ref}>
      <View style={styles.container}>
        {/* Вибір настрою */}
        <View style={styles.moodRow}>
          {MoodEmoji.map((item) => (
            <TouchableOpacity
              key={item.value}
              onPress={() => setMood(item.value)}
              style={[
                styles.moodBtn,
                mood === item.value && styles.moodSelected,
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.moodEmoji}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Title */}
        <TextInput
          style={styles.titleInput}
          placeholder="Заголовок"
          placeholderTextColor={colors.text}
          value={title}
          onChangeText={setTitle}
        />

        {/* Content */}
        <TextInput
          style={styles.contentInput}
          placeholder="Текст запису..."
          placeholderTextColor={colors.text}
          value={content}
          onChangeText={setContent}
          multiline
        />

        {/* Зберегти */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Зберегти</Text>
          )}
        </TouchableOpacity>
      </View>
    </SideSheet>
  );
});

AddNewEntry.displayName = "AddNewEntry";

export default AddNewEntry;

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: colors.background,
    },
    moodRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 24,
      gap: 4,
    },
    moodBtn: {
      padding: 10,
      borderRadius: 24,
    },
    moodSelected: {
      backgroundColor: colors.radioSelectedBackground,
    },
    moodEmoji: {
      fontSize: 35,
    },
    titleInput: {
      borderBottomWidth: 1,
      borderBottomColor: colors.radioBorder,
      fontSize: 18,
      paddingVertical: 8,
      marginBottom: 18,
      color: colors.text,
    },
    contentInput: {
      minHeight: 120,
      maxHeight: 250,
      borderWidth: 1,
      borderColor: colors.radioBorder,
      borderRadius: 14,
      fontSize: 16,
      padding: 14,
      color: colors.text,
      marginBottom: 32,
      textAlignVertical: "top",
    },
    saveBtn: {
      marginTop: "auto",
      backgroundColor: colors.main,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
    },
    saveBtnText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "600",
    },
  });
