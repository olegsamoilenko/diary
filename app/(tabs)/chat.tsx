import { Image } from "expo-image";
import { Platform, StyleSheet, Keyboard, Dimensions } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import React, { useEffect, useRef, useState } from "react";

export default function Chat() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [content, setContent] = React.useState<string>("");
  const handleHead = ({ tintColor }: { tintColor: string }) => (
    <ThemedText style={{ color: tintColor }}>H1</ThemedText>
  );

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [editorHeight, setEditorHeight] = useState(300); // дефолт
  const richText = useRef(null);

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
    // Розрахунок динамічної висоти редактора
    const screenHeight = Dimensions.get("window").height;
    // 200 — це приблизна висота тулбара + SafeArea + інше
    const reservedHeight = 50;
    const maxHeight = screenHeight - keyboardHeight - reservedHeight;
    if (keyboardHeight === 0) {
      setEditorHeight(300);
    } else {
      setEditorHeight(maxHeight);
    }
  }, [keyboardHeight]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme].statusBarBg,
      }}
      edges={["top"]}
    >
      <ThemedView
        style={{
          flex: 1,
          // width: "90%",
          // marginHorizontal: "auto",
        }}
      >
        <RichEditor
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
            padding: 0 10px; 
            line-height: 20px; 
            display: flex; 
            flex-direction: column; 
            min-height: 200px; 
            position: absolute; 
            width: 80%;
            top: 0; right: 0; bottom: 0; left: 0;`,
          }}
        />
        <RichToolbar
          editor={richText}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
            actions.insertImage,
            actions.undo,
            actions.redo,
            actions.removeFormat,
            actions.setUnderline,
            actions.insertVideo,
            actions.checkboxList,
            actions.setStrikethrough,
          ]}
          iconMap={{
            [actions.heading1]: handleHead,
            //   [actions.setUnderline]: require("@/assets/images/rich/underline.png"),
            //   [actions.insertVideo]: require("@/assets/images/rich/video.png"),
            //   [actions.removeFormat]: require("@/assets/images/rich/remove_format.png"),
            //   [actions.undo]: require("@/assets/images/rich/undo.png"),
            //   [actions.redo]: require("@/assets/images/rich/redo.png"),
            //   [actions.checkboxList]: require("@/assets/images/rich/checkbox.png"),
          }}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
