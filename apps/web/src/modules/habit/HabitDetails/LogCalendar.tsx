import { useUser } from "@/hooks/use-user";
import { dayjs } from "@/lib/dayjs";
import { cn } from "@/lib/utils";
import { getHabitLogs } from "@/services/habit.service";
import { Habit, HabitLog } from "@/types/entities";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  DayPicker,
  DayPickerProps,
  getDefaultClassNames,
} from "react-day-picker";
import { vi } from "react-day-picker/locale";

export function LogCalendar({ habit }: { habit: Habit }) {
  const { user } = useUser();
  const defaultClassNames = getDefaultClassNames();
  const [month, setMonth] = useState<Date>(new Date());
  const { data: logs = [], isLoading: isLoadingLogs } = useQuery({
    queryKey: [
      "monthHabitLog",
      habit.id,
      dayjs(month).tz(user?.timezone).format("YYYY-MM"),
    ],
    queryFn: async () => {
      const res = await getHabitLogs(
        habit.id,
        Math.trunc(month.getTime() / 1000),
        "m",
      );
      if (res.error || !res.data) return [];

      return res.data;
    },
  });

  const modifiers: DayPickerProps["modifiers"] = {
    logged: logs.map((l) => new Date(l.forDate * 1000)),
  };

  return (
    <DayPicker
      timeZone={user?.timezone}
      month={month}
      onMonthChange={(m) => setMonth(m)}
      modifiers={modifiers}
      locale={vi}
      startMonth={new Date(habit.createdAt)}
      endMonth={new Date()}
      disabled={{ before: new Date(habit.createdAt), after: new Date() }}
      weekStartsOn={0}
      onDayClick={(day, m) => {
        console.log(m);
      }}
      formatters={{
        formatWeekdayName: (wd, ops, lib) =>
          lib?.format(wd, "eeeee", { locale: vi }) || `${wd.getDay()}`,
        formatCaption: (month, options, dateLib) =>
          dateLib?.format(month, "'Tháng' MM '-' yyyy") || ``,
      }}
      classNames={{
        day: cn(
          defaultClassNames.day,
          "rounded-sm bg-accent aspect-square max-w-12",
        ),
        selected: cn(defaultClassNames.selected),
        day_button: cn(
          defaultClassNames.day_button,
          "overflow-hidden! rounded-xl!",
        ),
        week: cn(
          defaultClassNames.week,
          "gap-x-1 md:gap-x-2 flex justify-around",
        ),
        weeks: cn(defaultClassNames.weeks, "gap-y-1 md:gap-y-2 flex flex-col"),
        weekdays: cn(
          defaultClassNames.weekdays,
          "flex justify-around gap-x-1 md:gap-x-2",
        ),
        chevron: cn(defaultClassNames.chevron, "fill-foreground!"),
        caption_label: cn(defaultClassNames.caption_label, "font-medium!"),
      }}
      modifiersClassNames={{
        disabled: cn("bg-transparent text-neutral-400!"),
        logged: cn("bg-primary! text-primary-foreground!"),
        freeze: cn("bg-transparent ring md:ring-2 ring-sky-600"),
        today: cn(
          "ring md:ring-2 ring-primary border! border-accent! appearance-auto! bg-transparent",
        ),
      }}
    />
  );
}
