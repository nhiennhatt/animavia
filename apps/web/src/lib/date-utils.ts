export function getStartOfWeek(date: Date = new Date()) {
  const currentDay = date.getDay();
  const start = new Date(date);

  start.setDate(date.getDate() - currentDay);
  start.setHours(0, 0, 0, 0);

  return start;
}

export function getDayOfDate(date: Date, currentStartOfWeek: Date = getStartOfWeek()) {
  if (getStartOfWeek(date).getTime() !== currentStartOfWeek.getTime())
    return -1;
  return date.getDay();
}

export function isToday(date: Date) {
  const now = new Date();
  const startOfToday = new Date(date);
  now.setHours(0, 0, 0, 0);
  startOfToday.setHours(0, 0, 0, 0);
  return now.getTime() === startOfToday.getTime();
}