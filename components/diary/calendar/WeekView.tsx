import React from "react";
import { View, Text, Pressable } from "react-native";
import * as Localization from "expo-localization";
import { FIRST_DAY_BY_LOCALE } from "@/constants/FirstDayByLocale";
import {
  addDays,
  getWeekdayLabels,
  getMonthYearStr,
  getNumbersMonthAndYear,
} from "@/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import i18n from "i18next";

function getWeekDates(
  selectedDate: string | number | Date,
  firstDayOfWeek = 1,
) {
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
  weekAnchorDay: string | number | Date;
  setWeekAnchorDay: (d: string) => void;
  selectedDay: string | number | Date | undefined;
  setSelectedDay: (day: string | undefined) => void;
  moodByDate: Record<string, string | undefined>;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  onBackToMonth: () => void;
};

export default function WeekView({
  weekAnchorDay,
  setWeekAnchorDay,
  selectedDay,
  setSelectedDay,
  moodByDate,
  setMonth,
  setYear,
  onBackToMonth,
}: WeekViewProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const localeArr = Localization.getLocales();
  const locale = localeArr[0]?.languageTag ?? "en-US";
  const firstDayOfWeek = FIRST_DAY_BY_LOCALE[locale] ?? 1;
  const lang = i18n.language || "uk";

  const weekDates = getWeekDates(weekAnchorDay, firstDayOfWeek);

  const weekdayLabels = getWeekdayLabels(lang, firstDayOfWeek);

  const monthYearStr = getMonthYearStr(weekDates[0], lang);

  const prevWeek = () => {
    const newDate = addDays(weekDates[0], -7);
    setWeekAnchorDay(newDate);
    setSelectedDay(undefined);

    const { month, year } = getNumbersMonthAndYear(newDate);
    setMonth(month);
    setYear(year);
  };
  const nextWeek = () => {
    const newDate = addDays(weekDates[0], 7);
    setWeekAnchorDay(newDate);
    setSelectedDay(undefined);

    const { month, year } = getNumbersMonthAndYear(newDate);
    setMonth(month);
    setYear(year);
  };

  return (
    <View style={{ paddingHorizontal: 12, marginTop: 9 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Pressable
          onPress={prevWeek}
          style={{
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons
            name="triangle"
            size={8}
            color={colors.main}
            style={{
              transform: [
                { rotate: "270deg" },
                { scaleX: 1.4 },
                { scaleY: 0.8 },
              ],
              marginLeft: 11,
            }}
          />
        </Pressable>
        <Text style={{ fontSize: 16, color: colors.text }}>
          {monthYearStr.slice(0, 1).toUpperCase() + monthYearStr.slice(1, -3)}
        </Text>
        <Pressable
          onPress={nextWeek}
          style={{
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons
            name="triangle"
            size={8}
            color={colors.main}
            style={{
              transform: [
                { rotate: "90deg" },
                { scaleX: 1.4 },
                { scaleY: 0.8 },
              ],
              marginRight: 11,
            }}
          />
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 2,
        }}
      >
        {weekdayLabels.map((label, i) => (
          <Text
            key={label}
            style={{
              width: 40,
              textAlign: "center",
              color: "#888",
              fontSize: 14,
            }}
          >
            {label}
          </Text>
        ))}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {weekDates.map((item) => {
          const emoji = moodByDate[item];
          const isSelected = selectedDay === item;
          const day = Number(item.split("-")[2]);
          const itemMonth = Number(item.split("-")[1]);
          const month = Number(weekDates[0].split("-")[1]);
          return (
            <Pressable
              key={item}
              onPress={() => setSelectedDay(item)}
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isSelected ? colors.main : "transparent",
                borderRadius: 100,
                width: 40,
                height: 40,
                position: "relative",
              }}
            >
              <Text
                style={{
                  color:
                    itemMonth !== month
                      ? "gray"
                      : isSelected
                        ? "#ffffff"
                        : Colors[colorScheme].text,
                  fontWeight: isSelected ? "bold" : "normal",
                  fontSize: 14,
                  position: "absolute",
                  top: 0,
                  left: 8,
                }}
              >
                {day}
              </Text>
              {!!emoji && (
                <Text
                  style={{
                    fontSize: 17,
                    marginLeft: 4,
                    position: "absolute",
                    right: 3,
                    bottom: 3,
                  }}
                >
                  {emoji}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>

      <Pressable onPress={onBackToMonth}>
        <Text
          style={{
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            marginTop: 12,
            color: "#888",
          }}
        >
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color="#000"
            style={{
              transform: [{ scaleX: 5.6 }, { scaleY: 6.9 }],
              color: colors.icon,
            }}
          />
        </Text>
      </Pressable>
    </View>
  );
}
