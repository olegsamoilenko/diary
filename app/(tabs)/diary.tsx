import { StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { Calendar } from "react-native-calendars";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function Diary() {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme].statusBarBg,
      }}
      edges={["top"]}
    >
      <Calendar />
      <ParallaxScrollView>
        <ThemedView style={{ flex: 1 }}>
          <ThemedText>Записи за вибраний день</ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
