import { getTodayUnix } from "@/libs/utils/day";
import { dayjs } from "@/libs/utils/dayjs";
import { cn } from "@/libs/utils/tailwindcss";

const daysInWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const secondsInAHour = 60 * 60;
const secondsInADay = 24 * secondsInAHour;

export function WeekCalendar({
  logs = [],
  onLog,
  tz = "Asia/Ho_Chi_Minh",
}: {
  logs: number[];
  onLog: (forDate: number) => void;
  tz?: string;
}) {
  const startOfWeekUnix = dayjs().tz(tz).startOf("week").unix();
  const today = getTodayUnix(tz);
  const variants = daysInWeek.map((name, i) => {
    const dayUnix = startOfWeekUnix + i * secondsInADay;
    return {
      name,
      isActive: logs.some((l) => l === dayUnix),
      isToday: today === dayUnix,
      isPast: dayUnix < today,
      isFuture: dayUnix > today,
      dayUnix,
    };
  });

  return (
    <div className="flex flex-col gap-y-0.5 items-stretch">
      <div className="flex gap-x-2 justify-between">
        {daysInWeek.map((d) => (
          <span className="text-xs w-6 text-center font-mono" key={d}>
            {d}
          </span>
        ))}
      </div>
      <div
        className={cn(
          "flex gap-x-2 justify-between",
          "*:size-6 *:rounded-full *:border *:border-neutral-400",
          "*:data-active:bg-primary",
          "*:data-[today=true]:ring *:data-[today=true]:ring-primary/80",
          "*:not-data-active:data-[today=true]:cursor-pointer",
          "*:data-disabled:bg-accent",
        )}
      >
        {variants.map((d) => (
          <button
            data-today={d.isToday}
            data-active={d.isActive}
            data-disabled={d.isPast && !d.isActive}
            disabled={d.isPast || d.isFuture || d.isActive}
            onClick={() => onLog(d.dayUnix)}
            key={d.name}
          ></button>
        ))}
      </div>
    </div>
  );
}
