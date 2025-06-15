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
import { Theme } from "@/constants/Theme";
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
import * as SecureStore from "expo-secure-store";
import { useTranslation } from "react-i18next";

export default function Diary() {
  const { t } = useTranslation();
  const aiModel = useAppSelector((state) => state.settings.aiModel);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
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
  const [moodByDateBeforeConvert, setMoodByDateBeforeConvert] = useState<
    { date: string; mood: number; length: number }[]
  >([]);
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
    moods: { date: string; mood: number; length: number }[],
  ): Record<string, string> {
    return moods.reduce(
      (acc, { date, mood, length }) => {
        acc[date] = emojiByValue[Math.round(mood / length)] ?? "🙂";
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

    const user = await SecureStore.getItemAsync("user");

    if (!user) return;

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

      setWeekAnchorDay(selectedDay as string);
      setShowWeek(true);
    } catch (error) {
      console.error("Error fetching diary entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateAiContent = async (
    entryId: number,
    content: string,
    embedding: number[],
    aiModel: string,
    mood: number,
  ) => {
    setExpanded({});
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
            embedding,
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
    setMoodByDateBeforeConvert((prev) => {
      const idx = prev.findIndex((p) => p.date === todayStr);

      if (idx !== -1) {
        const obj = prev[idx];
        const newLength = (obj.length ?? 1) + 1;
        const newMood = obj.mood + newEntry.mood;

        return [
          ...prev.slice(0, idx),
          { ...obj, mood: Math.round(newMood), length: newLength },
          ...prev.slice(idx + 1),
        ];
      } else {
        return [...prev, { date: todayStr, mood: newEntry.mood, length: 1 }];
      }
    });

    setWeekAnchorDay(todayStr);
    setJustAddedTodayEntry(true);
    setShowWeek(true);
    await generateAiContent(
      Number(newEntry.id),
      newEntry.content,
      newEntry.embedding,
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
      const user = await SecureStore.getItemAsync("user");

      if (!user) return;
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

        setMoodByDateBeforeConvert(response.data);
      } catch (error) {
        console.error("Error fetching moods by date:", error);
      }
    };

    fetchMoodsByDate();
  }, [month, year, offsetMinutes]);

  useEffect(() => {
    setMoodByDate(moodsArrayToDict(moodByDateBeforeConvert));
  }, [moodByDateBeforeConvert]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.statusBarBg,
      }}
      edges={["top"]}
    >
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.main} />
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
                      backgroundColor: colors.entryBackground,
                      padding: 8,
                      borderRadius: 8,
                      marginBottom: 8,
                    }}
                  >
                    <ThemedView
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        backgroundColor: colors.entryBackground,
                      }}
                    >
                      <ThemedView
                        style={{
                          flexDirection: "row",
                          alignItems: "flex-start",
                          flex: 1,
                          backgroundColor: colors.entryBackground,
                          marginBottom: 8,
                        }}
                      >
                        {MoodEmoji.find(
                          (mood) => mood.value === entry.mood,
                        ) && (
                          <ThemedView
                            style={{
                              justifyContent: "flex-start",
                              flexDirection: "row",
                              alignItems: "flex-start",
                            }}
                          >
                            <ThemedText
                              style={{
                                fontSize: 22,
                                marginRight: 8,
                              }}
                            >
                              {MoodEmoji.find(
                                (mood) => mood.value === entry.mood,
                              )?.label ?? ""}
                            </ThemedText>
                          </ThemedView>
                        )}

                        <ThemedText type="subtitle">{entry.title}</ThemedText>
                      </ThemedView>

                      <ThemedView
                        style={{
                          justifyContent: "flex-start",
                          flexDirection: "row",
                          alignItems: "flex-start",
                        }}
                      >
                        <ThemedText
                          type="default"
                          style={{
                            marginLeft: 8,
                            fontSize: Theme.fontSizes.small,
                            color: colors.text,
                          }}
                        >
                          {new Date(entry.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </ThemedText>
                      </ThemedView>
                    </ThemedView>

                    <Pressable
                      key={entry.id}
                      onPress={() => toggleExpand(Number(entry.id))}
                    >
                      <ThemedView
                        style={{
                          backgroundColor: colors.diaryNotesBackground,
                          borderRadius: 4,
                          padding: 8,
                          marginBottom: 8,
                          elevation: 6,
                        }}
                      >
                        <ThemedText
                          numberOfLines={
                            expanded[Number(entry.id)] ? undefined : 3
                          }
                        >
                          {entry.content}
                        </ThemedText>
                      </ThemedView>
                      {expanded[Number(entry.id)] && entry.aiComment && (
                        <ThemedView
                          style={{
                            backgroundColor: colors.aiCommentBackground,
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
                ))) || <ThemedText>{t("diary.noRecords")}</ThemedText>}
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
