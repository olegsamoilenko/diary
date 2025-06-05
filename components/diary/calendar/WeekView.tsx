import React from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import * as Localization from "expo-localization";
import { FIRST_DAY_BY_LOCALE } from "@/constants/firstDayByLocale";

function getWeekDates(selectedDate: string | null, firstDayOfWeek = 1) {
  const date = new Date(selectedDate);
  let weekDay = date.getDay(); // 0 (Sun) ... 6 (Sat)
  let diff = weekDay - firstDayOfWeek;
  if (diff < 0) diff += 7;

  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - diff);

  return Array(7)
    .fill(0)
    .map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    });
}

type WeekViewProps = {
  selectedDay: string | null;
  setSelectedDay: (day: string) => void;
  moodByDate: Record<string, string | undefined>;
  onBackToMonth: () => void;
};

export default function WeekView({
  selectedDay,
  setSelectedDay,
  moodByDate,
  onBackToMonth,
}: WeekViewProps) {
  const localeArr = Localization.getLocales();

  const locale = localeArr[0]?.languageTag ?? "en-US";
  const firstDayOfWeek = FIRST_DAY_BY_LOCALE[locale] ?? 1;

  const weekDates = getWeekDates(selectedDay, firstDayOfWeek);

  return (
    <View>
      <FlatList
        data={weekDates}
        keyExtractor={(item) => item}
        horizontal
        renderItem={({ item }) => {
          const emoji = moodByDate[item];
          const isSelected = selectedDay === item;
          const day = Number(item.split("-")[2]);
          return (
            <Pressable
              onPress={() => setSelectedDay(item)}
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isSelected
                  ? "rgba(67, 160, 71, 0.15)"
                  : "transparent",
                borderRadius: 100,
                width: 36,
                height: 36,
                margin: 2,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    color: "black",
                    fontWeight: isSelected ? "bold" : "normal",
                    fontSize: 16,
                  }}
                >
                  {day}
                </Text>
                {!!emoji && (
                  <Text style={{ fontSize: 17, marginLeft: 4 }}>{emoji}</Text>
                )}
              </View>
            </Pressable>
          );
        }}
      />
      <Pressable onPress={onBackToMonth}>
        <Text style={{ marginTop: 12, textAlign: "center", color: "#6C47FF" }}>
          ← Повернути місяць
        </Text>
      </Pressable>
    </View>
  );
}
