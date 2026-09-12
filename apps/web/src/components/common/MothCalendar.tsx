import { useMemo } from "react";
import {
  DayPicker,
  DayPickerProps,
  getDefaultClassNames,
} from "@daypicker/react";
import { vi } from "@daypicker/react/locale";
import { format } from "date-fns";
import { CalendarDayButton } from "./CalendarDayButton";
import { cn } from "@/libs/utils/tailwindcss";
import { dayjs } from "@/libs/utils/dayjs";
import { useLogHabit } from "@/store/use-log-habit";

const defaultClassNames = getDefaultClassNames();

export function MonthCalendar({
  logs,
  tz,
  habitId,
  habitName,
  startDate,
}: {
  logs: number[];
  tz: string;
  habitId: string;
  habitName: string;
  startDate: string;
}) {
  const setLoggingHabit = useLogHabit((s) => s.setLogHabit);
  const currentUnix = dayjs().tz(tz).startOf("d").unix();
  const modifiers: DayPickerProps["modifiers"] = useMemo(
    () => ({
      logged: logs.map((l) => new Date(l * 1000)),
      isDisabled: (d) => Math.trunc(d.getTime() / 1000) !== currentUnix,
    }),
    [logs, currentUnix],
  );

  return (
    <DayPicker
      timeZone={tz}
      modifiers={modifiers}
      navLayout="around"
      startMonth={new Date(startDate)}
      endMonth={new Date()}
      locale={vi}
      formatters={{
        formatCaption: (month, options, lib) =>
          format(month, "LL/yyyy", options),
        formatWeekdayName: (weekday, options, lib) =>
          format(weekday, "EEEEE", options),
      }}
      components={{
        DayButton: CalendarDayButton,
      }}
      classNames={{
        day: cn(defaultClassNames.day, "text-xs p-0.5 md:p-1"),
        chevron: cn(defaultClassNames.chevron, "fill-primary!"),
      }}
      modifiersClassNames={{
        today: "font-medium",
      }}
      onDayClick={(date, m) => {
        if (!m.logged && m.today)
          setLoggingHabit({
            habitId,
            forDate: Math.trunc(date.getTime() / 1000),
            habitName,
          });
      }}
    />
  );
}
