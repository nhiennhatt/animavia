import { cn } from "@/lib/utils";
import { Habit, HabitLog } from "@/types/entities";
import { BaseUser } from "@/types/user";
import {
  DayPicker,
  DayPickerProps,
  getDefaultClassNames,
} from "react-day-picker";
import { vi } from "react-day-picker/locale";
import { dayjs } from "@/lib/dayjs";

export function LogCalendar({
  habit,
  month,
  setMonth,
  logs,
  user,
  onClickDay,
}: {
  habit: Habit;
  month: Date;
  setMonth: (date: Date) => void;
  logs: HabitLog[];
  user: BaseUser;
  onClickDay: DayPickerProps["onDayClick"];
}) {
  const defaultClassNames = getDefaultClassNames();
  const modifiers: DayPickerProps["modifiers"] = {
    logged: logs.map((l) => new Date(l.forDate * 1000)),
    freeze:
      !logs.some((l) =>
        dayjs
          .unix(l.forDate)
          .tz(user.timezone)
          .add(1, "d")
          .isSame(dayjs().tz(user.timezone), "d"),
      ) && dayjs().tz(user.timezone).hour() < 7
        ? [dayjs().tz(user.timezone).subtract(1, "d").toDate()]
        : [],
  };

  return (
    <DayPicker
      timeZone={user.timezone}
      month={month}
      onMonthChange={(m) => setMonth(m)}
      modifiers={modifiers}
      locale={vi}
      startMonth={new Date(habit.createdAt)}
      endMonth={new Date()}
      disabled={{ before: new Date(habit.createdAt), after: new Date() }}
      weekStartsOn={0}
      onDayClick={onClickDay}
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
