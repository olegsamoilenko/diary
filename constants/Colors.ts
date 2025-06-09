/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#344360";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    main: "#344360",
    text: "#2E3A59",
    background: "#F7F8FA",
    error: "",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    statusBarBg: "#F7F8FA",
    // radio
    radioBackground: "#fff",
    radioBorder: "#aaa",
    radioSelectedBorder: "#0284c7",
    radioSelectedBackground: "#eee",
    radioSelectedDot: "#0284c7",
    // input: "#f2f3f7",
    // input
    inputBackground: "",
    inputBorderColor: "",
    // diary
    diaryNotesBackground: "#EFE7DA",
    aiCommentBackground: "#ECECEC",
    // calendar
    calendarBackground: "",
  },
  dark: {
    main: "#344360",
    text: "#ECEDEE",
    background: "#151718",
    error: "",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    statusBarBg: "#121212",
    // radio
    radioBackground: "#151718",
    radioBorder: "#9BA1A6",
    radioSelectedBorder: "#fff",
    radioSelectedBackground: "#151718",
    radioSelectedDot: "#fff",
    // input
    input: "#151718",
    inputBackground: "",
    inputBorderColor: "",
    // diary
    diaryNotesBackground: "",
    aiCommentBackground: "",
    // calendar
    calendarBackground: "",
  },
};
