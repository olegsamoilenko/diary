import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ColorTheme } from "@/types";
import { StyleSheet } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function Logo() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);
  return (
    <ThemedView>
      <ThemedText style={styles.logo}>Nemory</ThemedText>
    </ThemedView>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    logo: {
      paddingVertical: 10,
      fontSize: 30,
      fontWeight: "bold",
      color: colors.main,
      marginTop: 35,
    },
  });
