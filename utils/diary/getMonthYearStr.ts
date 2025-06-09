export function getMonthYearStr(dateStr: string, locale: string) {
  const date = new Date(dateStr);
  return date.toLocaleString(locale, {
    month: "long",
    year: "numeric",
  });
}
