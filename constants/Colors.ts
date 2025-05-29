/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    statusBarBg: "#fff",
    radioBackground: "#fff",
    radioBorder: "#aaa",
    radioSelectedBorder: "#0284c7",
    radioSelectedBackground: "#eee",
    radioSelectedDot: "#0284c7",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    statusBarBg: "#121212",
    radioBackground: "#151718",
    radioBorder: "#9BA1A6",
    radioSelectedBorder: "#fff",
    radioSelectedBackground: "#151718",
    radioSelectedDot: "#fff",
  },
};
