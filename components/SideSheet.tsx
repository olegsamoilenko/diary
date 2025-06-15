import React, {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";

export interface SideSheetRef {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

interface SideSheetProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  isKeyboardOpen: boolean;
}

const SideSheet = forwardRef<SideSheetRef, SideSheetProps>(
  ({ children, style, isKeyboardOpen }, ref) => {
    const [visible, setVisible] = useState<boolean>(false);
    const translateX = useRef<Animated.Value>(
      new Animated.Value(Dimensions.get("window").width),
    ).current;
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();

    const openSideScreen = () => {
      setVisible(true);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 320,
        useNativeDriver: true,
      }).start();
    };

    const closeSideScreen = () => {
      Animated.timing(translateX, {
        toValue: Dimensions.get("window").width,
        duration: 320,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    };

    useImperativeHandle(
      ref,
      () => ({
        open: openSideScreen,
        close: closeSideScreen,
        isOpen: visible,
      }),
      [visible],
    );

    if (!visible) return null;

    return (
      <Animated.View
        style={[
          styles.sideScreen,
          {
            transform: [{ translateX }],
            paddingBottom: insets.bottom,
            paddingTop: insets.top,
            backgroundColor: Colors[colorScheme].background,
          },
          style,
        ]}
      >
        <ParallaxScrollView isPadding={false}>
          {!isKeyboardOpen && (
            <TouchableOpacity
              onPress={() => {
                closeSideScreen();
              }}
              style={styles.closeBtn}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={28}
                color={Colors[colorScheme].text}
              />
            </TouchableOpacity>
          )}

          <ThemedView style={styles.content}>{children}</ThemedView>
        </ParallaxScrollView>
      </Animated.View>
    );
  },
);

SideSheet.displayName = "SideSheet";

export default SideSheet;

const styles = StyleSheet.create({
  sideScreen: {
    position: "absolute",
    top: 0,
    right: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "#fff",
    zIndex: 100,
    elevation: 10,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  closeBtn: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
});
