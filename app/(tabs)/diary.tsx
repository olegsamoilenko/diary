import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
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
import Animated from "react-native-reanimated";
import { useAppSelector } from "@/store/hooks";
import { AILoader } from "@/components/ui/AILoader";

export default function Diary() {
  const aiModel = useAppSelector((state) => state.settings.aiModel);
  const colorScheme = useColorScheme();
  const addNewEntryRef = useRef<SideSheetRef>(null);
  const [selectedDay, setSelectedDay] = useState<
    string | number | Date | undefined
  >(new Date().toISOString().split("T")[0]);
  const [weekAnchorDay, setWeekAnchorDay] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [diaryEntries, setDiaryEntries] = useState<Record<string, Entry[]>>({});
  const [month, setMonth] = useState<number | null>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number | null>(new Date().getFullYear());
  const [moodByDate, setMoodByDate] = useState<Record<string, string>>({});
  const [showWeek, setShowWeek] = useState(false);
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  const offsetMinutes = new Date().getTimezoneOffset() * -1;

  const emojiByValue: Record<number, string> = Object.fromEntries(
    MoodEmoji.map(({ value, label }) => [value, label]),
  );
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const scrollRef = useRef<Animated.ScrollView>(null);
  const [loading, setLoading] = useState(true);
  const [justAddedTodayEntry, setJustAddedTodayEntry] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

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

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const fetchDiaryEntries = async () => {
    if (justAddedTodayEntry) return;
    setLoading(true);

    try {
      const response = await apiRequest({
        url: "/diary-entries/get-by-date",
        method: "POST",
        data: {
          date: selectedDay,
          timeZone,
        },
      });

      setDiaryEntries((prev) => ({
        ...prev,
        [selectedDay?.toString() || "unknown"]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching diary entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateAiContent = async (
    entryId: number,
    content: string,
    aiModel: string,
    mood: number,
  ) => {
    setIsAiLoading(true);
    setExpanded((prev) => ({
      ...prev,
      [entryId]: true,
    }));
    try {
      const response = await apiRequest({
        url: "/ai/generate-comment",
        method: "POST",
        data: {
          entryId,
          data: {
            content,
            aiModel,
            mood,
          },
        },
      });

      setDiaryEntries((prev) => ({
        ...prev,
        [new Date().toISOString().split("T")[0] as string]:
          prev[new Date().toISOString().split("T")[0] as string]?.map(
            (entry) => {
              if (Number(entry.id) === entryId) {
                return { ...entry, aiComment: response.data };
              }
              return entry;
            },
          ) || [],
      }));

      setIsAiLoading(false);
    } catch (error) {
      console.error("Error generating AI content:", error);
    }
  };

  const handleAfterAddEntry = async (newEntry: Entry) => {
    const todayStr = new Date().toISOString().split("T")[0];
    setSelectedDay(todayStr);
    setDiaryEntries((prev) => ({
      ...prev,
      [todayStr]: [...(prev[todayStr] ?? []), newEntry],
    }));
    setWeekAnchorDay(todayStr);
    setJustAddedTodayEntry(true);
    await generateAiContent(
      Number(newEntry.id),
      newEntry.content,
      aiModel,
      newEntry.mood,
    );
  };

  useEffect(() => {
    if (selectedDay && timeZone) {
      fetchDiaryEntries();
    }
  }, [selectedDay, timeZone]);

  useEffect(() => {
    if (justAddedTodayEntry) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
        setJustAddedTodayEntry(false);
      }, 100);
    }
  }, [justAddedTodayEntry]);

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
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={Colors[colorScheme].main} />
        </View>
      ) : (
        <>
          {!showWeek ? (
            <MonthView
              selectedDay={selectedDay}
              onDayPress={(dayStr: string) => {
                setSelectedDay(dayStr);
                setWeekAnchorDay(dayStr);
                setShowWeek(true);
              }}
              moodByDate={moodByDate}
              setMonth={setMonth}
              setYear={setYear}
              setShowWeek={setShowWeek}
            />
          ) : (
            <WeekView
              weekAnchorDay={weekAnchorDay}
              setWeekAnchorDay={setWeekAnchorDay}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              moodByDate={moodByDate}
              setMonth={setMonth}
              setYear={setYear}
              onBackToMonth={() => setShowWeek(false)}
            />
          )}
          <ParallaxScrollView scrollRef={scrollRef}>
            <ThemedView style={{ flex: 1 }}>
              {(diaryEntries[selectedDay as string] &&
                diaryEntries[selectedDay as string].length > 0 &&
                diaryEntries[selectedDay as string].map((entry: Entry) => (
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
                        {MoodEmoji.find(
                          (mood) => mood.value === entry.mood,
                        ) && (
                          <Text style={{ fontSize: 22, marginRight: 8 }}>
                            {MoodEmoji.find((mood) => mood.value === entry.mood)
                              ?.label ?? ""}
                          </Text>
                        )}

                        <ThemedText
                          type="subtitle"
                          numberOfLines={1}
                          style={{ flexShrink: 1 }}
                        >
                          {entry.title}
                        </ThemedText>
                      </ThemedView>

                      <ThemedText
                        type="default"
                        style={{
                          marginLeft: 8,
                          color: Colors[colorScheme].text,
                        }}
                      >
                        {new Date(entry.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </ThemedText>
                    </ThemedView>

                    <Pressable
                      key={entry.id}
                      onPress={() => toggleExpand(Number(entry.id))}
                    >
                      <ThemedView
                        style={{
                          backgroundColor:
                            Colors[colorScheme].diaryNotesBackground,
                          borderRadius: 8,
                          paddingLeft: 4,
                          marginBottom: 8,
                          elevation: 6,
                        }}
                      >
                        <ThemedText
                          numberOfLines={
                            expanded[Number(entry.id)] ? undefined : 3
                          }
                          style={{ marginTop: 6 }}
                        >
                          {entry.content}
                        </ThemedText>
                      </ThemedView>
                      {expanded[Number(entry.id)] && (
                        <ThemedView
                          style={{
                            backgroundColor:
                              Colors[colorScheme].aiCommentBackground,
                            borderRadius: 18,
                            paddingLeft: 4,
                            width: "80%",
                            elevation: 6,
                          }}
                        >
                          {isAiLoading ? (
                            <AILoader />
                          ) : (
                            <ThemedText style={{ marginTop: 6 }}>
                              {entry.aiComment?.content}
                            </ThemedText>
                          )}
                        </ThemedView>
                      )}
                    </Pressable>
                  </ThemedView>
                ))) || <ThemedText>Немає записів за цей день</ThemedText>}
            </ThemedView>
          </ParallaxScrollView>
          <AddButton
            onPress={() => {
              addNewEntryRef.current?.open();
            }}
          />
          <AddNewEntry
            ref={addNewEntryRef}
            onSuccess={(entry) => handleAfterAddEntry(entry)}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
