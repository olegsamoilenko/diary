const WEEKDAY_LABELS: Record<string, string[]> = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  uk: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
};

export function getWeekdayLabels(locale: string, firstDayOfWeek = 1) {
  const labels = WEEKDAY_LABELS[locale] || WEEKDAY_LABELS["en-US"];
  return [...labels.slice(firstDayOfWeek), ...labels.slice(0, firstDayOfWeek)];
}
