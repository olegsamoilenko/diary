import { StyleSheet, View, Text, Pressable, Button } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { Calendar } from "react-native-calendars";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useEffect, useRef, useState } from "react";
import AddButton from "@/components/ui/AddButton";
import { SideSheetRef } from "@/components/SideSheet";
import AddNewEntry from "@/components/diary/AddNewEntry";
import { apiRequest } from "@/utils";
import { Entry } from "@/types";
import { MoodEmoji } from "@/constants/Mood";
import WeekView from "@/components/diary/calendar/WeekView";
import MonthView from "@/components/diary/calendar/MonthView";

export default function Diary() {
  const colorScheme = useColorScheme();
  const addNewEntryRef = useRef<SideSheetRef>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(
    new Date().toISOString().split("T")[0],
  );
  const [diaryEntriesByDate, setDiaryEntriesByDate] = useState<Entry[] | null>(
    null,
  );
  const [month, setMonth] = useState<number | null>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number | null>(new Date().getFullYear());
  const [moodByDate, setMoodByDate] = useState<Record<string, string>>({});
  const [showWeek, setShowWeek] = useState(false);

  const offsetMinutes = new Date().getTimezoneOffset() * -1;

  const emojiByValue: Record<number, string> = Object.fromEntries(
    MoodEmoji.map(({ value, label }) => [value, label]),
  );

  function moodsArrayToDict(
    moods: { date: string; value: number }[],
  ): Record<string, string> {
    return moods.reduce(
      (acc, { date, value }) => {
        acc[date] = emojiByValue[value] ?? "🙂";
        return acc;
      },
      {} as Record<string, string>,
    );
  }

  useEffect(() => {
    const fetchDiaryEntries = async () => {
      try {
        const response = await apiRequest({
          url: "/diary-entries/get-by-date",
          method: "POST",
          data: {
            date: selectedDay,
            offsetMinutes,
          },
        });
        setDiaryEntriesByDate(response.data);
      } catch (error) {
        console.error("Error fetching diary entries:", error);
      }
    };

    fetchDiaryEntries();
  }, [selectedDay, offsetMinutes]);

  useEffect(() => {
    const fetchMoodsByDate = async () => {
      try {
        const response = await apiRequest({
          url: "/diary-entries/get-moods-by-date",
          method: "POST",
          data: {
            month,
            year,
            offsetMinutes,
          },
        });
        setMoodByDate(moodsArrayToDict(response.data));
      } catch (error) {
        console.error("Error fetching moods by date:", error);
      }
    };

    fetchMoodsByDate();
  }, [month, year, offsetMinutes]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme].statusBarBg,
      }}
      edges={["top"]}
    >
      {!showWeek ? (
        <MonthView
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          moodByDate={moodByDate}
          setMonth={setMonth}
          setYear={setYear}
          setShowWeek={setShowWeek}
        />
      ) : (
        <WeekView
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          moodByDate={moodByDate}
          onBackToMonth={() => setShowWeek(false)}
        />
      )}
      <ParallaxScrollView>
        <ThemedView style={{ flex: 1 }}>
          {(diaryEntriesByDate &&
            diaryEntriesByDate.length > 0 &&
            diaryEntriesByDate.map((entry) => (
              <ThemedView
                key={entry.id}
                style={{
                  backgroundColor: "#fff",
                  padding: 8,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              >
                <ThemedView
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#fff",
                  }}
                >
                  {/* Зліва: емоджі + title (можна теж flex, щоб тайтл не стискався сильно) */}
                  <ThemedView
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                      backgroundColor: "#fff",
                    }}
                  >
                    {/* Емоджі настрою */}
                    <Text style={{ fontSize: 22, marginRight: 8 }}>
                      {MoodEmoji.find((mood) => mood.value === entry.mood)
                        ?.label ?? "🙂"}
                    </Text>
                    {/* Title */}
                    <ThemedText
                      type="subtitle"
                      numberOfLines={1}
                      style={{ flexShrink: 1 }}
                    >
                      {entry.title}
                    </ThemedText>
                  </ThemedView>

                  {/* З права: час */}
                  <ThemedText
                    type="caption"
                    style={{
                      marginLeft: 8,
                      color: Colors[colorScheme].textSecondary,
                    }}
                  >
                    {new Date(entry.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </ThemedText>
                </ThemedView>

                {/* Далі контент окремим рядком */}
                <ThemedText style={{ marginTop: 6 }}>
                  {entry.content}
                </ThemedText>
              </ThemedView>
            ))) || <ThemedText>Немає записів за цей день</ThemedText>}
        </ThemedView>
      </ParallaxScrollView>
      <AddButton
        onPress={() => {
          addNewEntryRef.current?.open();
        }}
      />
      <AddNewEntry ref={addNewEntryRef} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
