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
    secondText: "#687076",
    background: "#F7F8FA",
    secondBackground: "#F7F8FA",
    border: "#E0E0E0",
    error: "#B9130F",
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
    // input
    inputBackground: "#ffffff",
    inputBorder: "#e6e4e4",
    // diary
    diaryNotesBackground: "#EFE7DA",
    aiCommentBackground: "#ECECEC",
    entryBackground: "#F7F8FA",
    // calendar
    calendarBackground: "#F7F8FA",

    // plans Modal
    tariff: "#536c9c",
    tokens: "#F7F8FA",
  },

  dark: {
    main: "#344360",
    text: "#ECEDEE",
    secondText: "#9BA1A6",
    background: "#151718",
    secondBackground: "#222627",
    border: "#2A2D2F",
    error: "#B9130F",
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
    inputBackground: "#000000",
    inputBorder: "#64676a",
    // diary
    diaryNotesBackground: "#4b5255",
    aiCommentBackground: "",
    entryBackground: "#353a3c",
    // calendar
    calendarBackground: "#151718",

    // plans Modal
    tariff: "#536c9c",
    tokens: "#F7F8FA",
  },
};
