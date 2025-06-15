import React, { forwardRef, useEffect, useRef, useState } from "react";
import SideSheet, { SideSheetRef } from "@/components/SideSheet";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  Keyboard,
  Dimensions,
  Platform,
} from "react-native";
import { ColorTheme, Entry } from "@/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { MoodEmoji } from "@/constants/Mood";
import { apiRequest } from "@/utils";
import { useAppSelector } from "@/store/hooks";
import { useTranslation } from "react-i18next";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import { ThemedView } from "@/components/ThemedView";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import Note from "@/assets/images/rich/Note";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const handleHead = ({ tintColor }) => (
  <Text style={{ color: tintColor }}>H1</Text>
);

const AddNewEntry = forwardRef<
  SideSheetRef,
  { onSuccess: (entry: Entry) => void }
>((props, ref) => {
  const aiModel = useAppSelector((state) => state.settings.aiModel);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);
  const [loading, setLoading] = useState(false);

  const [mood, setMood] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { t } = useTranslation();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [editorHeight, setEditorHeight] = useState(300); // дефолт
  const richText = useRef(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const iconMap = (color) => {
    return {
      [actions.setBold]: () => (
        <MaterialCommunityIcons name="format-bold" size={22} color={color} />
      ),
      [actions.setItalic]: () => (
        <MaterialCommunityIcons name="format-italic" size={22} color={color} />
      ),
      [actions.insertBulletsList]: () => (
        <MaterialCommunityIcons
          name="format-list-bulleted"
          size={22}
          color={color}
        />
      ),
      [actions.insertOrderedList]: () => (
        <MaterialCommunityIcons
          name="format-list-numbered"
          size={22}
          color={color}
        />
      ),
      [actions.insertImage]: () => (
        <MaterialCommunityIcons name="image-plus" size={22} color={color} />
      ),
      [actions.undo]: () => (
        <MaterialCommunityIcons name="undo" size={22} color={color} />
      ),
      [actions.redo]: () => (
        <MaterialCommunityIcons name="redo" size={22} color={color} />
      ),
      [actions.setUnderline]: () => (
        <MaterialCommunityIcons
          name="format-underline"
          size={22}
          color={color}
        />
      ),
      [actions.removeFormat]: () => (
        <MaterialCommunityIcons name="format-clear" size={22} color={color} />
      ),
    };
  };

  useEffect(() => {
    const onKeyboardShow = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardOpen(true);
    });

    const onKeyboardHide = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardOpen(false);
    });

    return () => {
      onKeyboardShow.remove();
      onKeyboardHide.remove();
    };
  }, []);

  useEffect(() => {
    const onShow = (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    };
    const onHide = () => {
      setKeyboardHeight(0);
    };
    const showSub = Keyboard.addListener("keyboardDidShow", onShow);
    const hideSub = Keyboard.addListener("keyboardDidHide", onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    const screenHeight = Dimensions.get("window").height;
    const reservedHeight = 80;
    const maxHeight = screenHeight - keyboardHeight - reservedHeight;
    if (keyboardHeight === 0) {
      setEditorHeight(200);
    } else {
      setEditorHeight(maxHeight);
    }
  }, [keyboardHeight]);

  const onPressAddImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });

      if (result.canceled || !result.assets?.length) return;
      const picked = result.assets[0];
      const localUri = picked.uri;

      if (picked.base64) {
        // richText.current?.insertImage(
        //   `data:image/jpeg;base64,${picked.base64}`,
        // );
        richText.current?.insertHTML(
          `<img src="data:image/jpeg;base64,${picked.base64}" style="max-width:70%;height:auto;border-radius:12px;margin:10px auto;display:block;" />`,
        );
      }

      const uploaded = await uploadImageToServer(localUri);

      if (uploaded && uploaded.url) {
        richText.current?.insertHTML(
          `<img src="${uploaded.url}" style="max-width:70%;height:auto;border-radius:12px;margin:10px auto;display:block;" />`,
        );
        // richText.current?.insertImage(uploaded.url);
      }
    } catch (error) {
      // TODO: Показати користувачу тоаст з помилкою.
      console.error("Error picking image:", error);
    }
  };

  async function uploadImageToServer(localUri: string) {
    const user = await SecureStore.getItemAsync("user");
    const formData = new FormData();
    formData.append("file", {
      uri:
        Platform.OS === "android" ? localUri : localUri.replace("file://", ""),
      name: `/user-${JSON.parse(user!).id}/image_${Date.now()}.jpg`,
      type: "image/jpeg",
    });

    const response = await apiRequest({
      url: `/files/upload`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        "x-amz-checksum-crc32": null,
      },
    });
    return await response.data;
  }

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
          aiModel,
        },
      });

      if (!res || res.status !== 201) {
        console.log("No data returned from server");
        setLoading(false);
        return;
      }

      const entry = res.data;

      setLoading(false);

      if (ref && typeof ref !== "function" && ref?.current) {
        ref.current.close();
      }

      if (props.onSuccess && entry) props.onSuccess(entry);

      setTitle("");
      setContent("");
      setMood(null);
    } catch (err) {
      console.log("Error saving entry.ts:", err);
      setLoading(false);
    }
  };

  return (
    <SideSheet ref={ref} isKeyboardOpen={isKeyboardOpen}>
      <ThemedView style={styles.container}>
        <ThemedView style={{ flex: 0, paddingBottom: 20 }}>
          {!isKeyboardOpen && (
            <ThemedView style={styles.moodRow}>
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
            </ThemedView>
          )}

          {!isKeyboardOpen && (
            <TextInput
              style={styles.titleInput}
              placeholder={t("diary.addEntryTitle")}
              placeholderTextColor={colors.text}
              value={title}
              onChangeText={setTitle}
            />
          )}
        </ThemedView>

        <ThemedView
          style={{
            flex: 0,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          <RichEditor
            key={"RichEditor" + colorScheme}
            ref={richText}
            initialContentHTML={content}
            onChange={setContent}
            style={{
              flex: 1,
              minHeight: editorHeight,
              maxHeight: editorHeight,
            }}
            useContainer
            initialFocus={false}
            disabled={false}
            editorStyle={{
              contentCSSText: `
            font-family: sans-serif; 
            font-size: 14px; 
            padding: 10px 10px; 
            line-height: 20px; 
            display: flex; 
            flex-direction: column; 
            min-height: 200px; 
            position: absolute; 
            top: 0; right: 0; bottom: 0; left: 0;
            background-color: ${colors.diaryNotesBackground};
            color: ${colors.text};`,
            }}
          />
          <RichToolbar
            key={"RichToolbar" + colorScheme}
            editor={richText}
            onPressAddImage={onPressAddImage}
            style={{
              backgroundColor: colors.background,
              borderColor: colors.inputBorder,
            }}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.undo,
              actions.redo,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.checkboxList,
              actions.insertLink,
              actions.insertImage,
              actions.setUnderline,
              actions.setStrikethrough,
              "heading1",
            ]}
            iconMap={{
              // ...iconMap(colors.icon),
              [actions.heading1]: handleHead,
            }}
          />
        </ThemedView>

        {/*<TextInput*/}
        {/*  style={[styles.contentInput, { flex: 1 }]}*/}
        {/*  placeholder={t("diary.addEntryContent")}*/}
        {/*  placeholderTextColor={colors.text}*/}
        {/*  value={content}*/}
        {/*  onChangeText={setContent}*/}
        {/*  multiline*/}
        {/*/>*/}

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>{t("diary.addEntryButton")}</Text>
          )}
        </TouchableOpacity>
      </ThemedView>
    </SideSheet>
  );
});

AddNewEntry.displayName = "AddNewEntry";

export default AddNewEntry;

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "column",
      flex: 1,
      padding: 0,
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
      borderBottomColor: colors.inputBorder,
      fontSize: 18,
      paddingVertical: 8,
      marginBottom: 18,
      color: colors.text,
    },
    contentInput: {
      borderWidth: 1,
      borderColor: colors.radioBorder,
      borderRadius: 14,
      fontSize: 16,
      padding: 14,
      color: colors.text,
      marginBottom: 20,
      textAlignVertical: "top",
      backgroundColor: colors.diaryNotesBackground,
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
