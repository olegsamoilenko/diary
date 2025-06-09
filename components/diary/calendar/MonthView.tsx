import { Colors } from "@/constants/Colors";
import { Pressable, Text } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as Localization from "expo-localization";
import { FIRST_DAY_BY_LOCALE } from "@/constants/FirstDayByLocale";
import i18n from "i18next";

type MonthViewProps = {
  selectedDay: string | number | Date | undefined;
  onDayPress: (day: string) => void;
  moodByDate: Record<string, string | undefined>;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  setShowWeek: (show: boolean) => void;
};
export default function MonthView({
  selectedDay,
  moodByDate,
  onDayPress,
  setMonth,
  setYear,
  setShowWeek,
}: MonthViewProps) {
  const colorScheme = useColorScheme();
  const localeArr = Localization.getLocales();
  const locale = localeArr[0]?.languageTag ?? "en-US";
  const firstDayOfWeek = FIRST_DAY_BY_LOCALE[locale] ?? 1;
  const lang = i18n.language || "uk";
  return (
    <Calendar
      key={lang}
      firstDay={firstDayOfWeek}
      theme={{
        calendarBackground: Colors[colorScheme].background,
        arrowColor: Colors[colorScheme].main,
      }}
      onMonthChange={(obj) => {
        setMonth(obj.month);
        setYear(obj.year);
      }}
      dayComponent={({ date, state }) => {
        if (!date) return null;
        const emoji = moodByDate[date.dateString];
        return (
          <Pressable
            onPress={() => onDayPress(date.dateString)}
            style={{
              alignItems: "center",
              backgroundColor:
                selectedDay === date.dateString
                  ? "rgba(67, 160, 71, 0.15)"
                  : "transparent",
              borderRadius: 100,
              position: "relative",
              width: "80%",
              height: 37,
            }}
          >
            <Text
              style={{
                color: state === "disabled" ? "gray" : "black",
                position: "absolute",
                top: 0,
                left: 8,
                zIndex: 100,
              }}
            >
              {date.day}
            </Text>
            {emoji && (
              <Text
                style={{
                  fontSize: 18,
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
      }}
    />
  );
}
