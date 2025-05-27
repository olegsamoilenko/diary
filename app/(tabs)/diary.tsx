import { StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { Calendar } from "react-native-calendars";

export default function Diary() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Calendar
      // тут додаткові налаштування, колір кружечків тощо
      />
      {/* Далі: список записів за вибраний день */}
      <ThemedView style={{ flex: 1, padding: 16 }}>
        <ThemedText>Записи за вибраний день</ThemedText>
        {/* Тут список, поки можеш статично */}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
