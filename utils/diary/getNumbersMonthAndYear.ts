export function getNumbersMonthAndYear(date: string | Date) {
  const d = new Date(date);
  return { month: d.getMonth() + 1, year: d.getFullYear() }; // month: 1–12
}
