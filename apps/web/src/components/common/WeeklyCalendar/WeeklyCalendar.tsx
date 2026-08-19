import { getDayOfDate, getStartOfWeek } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

const daysInWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export function WeeklyCalendar({ loggedDates = [] }: { loggedDates?: Date[] }) {
  const currentDayInWeek = new Date().getDay();
  const currentStartOfWeek = getStartOfWeek();
  const loggedDatesInWeek = loggedDates
    .map((d) => getDayOfDate(d, currentStartOfWeek))
    .filter((d) => d !== -1);

  return (
    <div
      className={cn(
        "grid grid-cols-7 gap-x-3",
        "*:aspect-square *:bg-white *:rounded-full *:flex *:items-center *:border *:border-accent *:justify-center",
        "*:data-active:bg-primary *:data-active:text-primary-foreground *:data-disabled:bg-accent",
        "*:data-[today=true]:ring-2 *:data-[today=true]:ring-primary",
        "max-w-md mx-auto"
      )}
    >
      {daysInWeek.map((d, i) => {
        const isActive = loggedDatesInWeek.indexOf(i) >= 0;

        return (
          <div
            key={`${i}-${d}`}
            data-active={isActive}
            data-disabled={!isActive && i < currentDayInWeek}
            data-today={i === currentDayInWeek}
            className="max-sm:text-xs"
          >
            {d}
          </div>
        );
      })}
    </div>
  );
}
