import { getDayOfDate, getStartOfWeek } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

const daysInWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export function WeeklyCalendar({
  loggedDates = [],
  onCheckin = (date: number) => {},
}: {
  loggedDates?: number[];
  onCheckin?: (date: number) => void;
}) {
  const currentDayInWeek = new Date().getDay();
  const currentStartOfWeek = getStartOfWeek();
  const loggedDatesInWeek = loggedDates
    .map((d) => getDayOfDate(new Date(d * 1000), currentStartOfWeek))
    .filter((d) => d !== -1);

  const isFreeze = new Date().getHours() < 7;

  return (
    <div
      className={cn(
        "grid grid-cols-7 gap-x-3",
        "*:aspect-square *:bg-white *:rounded-full *:flex *:items-center *:border *:border-accent *:justify-center",
        "*:data-active:bg-primary *:data-active:text-primary-foreground *:data-disabled:bg-accent",
        "*:data-[today=true]:ring-2 *:data-[today=true]:ring-primary",
        "*:data-[freeze=true]:ring-sky-600 *:data-[freeze=true]:ring-2 *:data-[freeze=true]:bg-white",
        "max-w-md mx-auto",
      )}
    >
      {daysInWeek.map((d, i) => {
        const isActive = loggedDatesInWeek.indexOf(i) >= 0;

        return (
          <button
            key={`${i}-${d}`}
            data-active={isActive}
            data-disabled={!isActive && i < currentDayInWeek}
            data-today={i === currentDayInWeek}
            data-freeze={!isActive && isFreeze && i === currentDayInWeek - 1}
            className="max-sm:text-xs"
            onClick={() => {
              if (
                !isActive &&
                (i === currentDayInWeek ||
                  (isFreeze && i === currentDayInWeek - 1))
              )
                onCheckin(
                  Math.trunc(currentStartOfWeek.getTime() / 1000) + i * 86400,
                );
            }}
          >
            {d}
          </button>
        );
      })}
    </div>
  );
}
