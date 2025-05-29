import { useThemeCustom } from "@/context/ThemeContext";

export function useColorScheme() {
  const { colorScheme } = useThemeCustom();
  return colorScheme;
}
