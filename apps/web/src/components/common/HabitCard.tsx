import { Habit } from "@/types/entities";
import { Button } from "../ui/button";
import { WeeklyCalendar } from "./WeeklyCalendar/WeeklyCalendar";
import { lifeDomainList } from "@/config/life-domain-list";
import { Fragment } from "react/jsx-runtime";

export function HabitCard({
  habit,
  loggedDates = [],
}: {
  habit: Habit & { statement?: string; source?: string };
  loggedDates?: Date[];
}) {
  return (
    <div className="border border-accent px-4 py-4 rounded-md flex flex-col justify-between gap-y-4">
      <div>
        <h3 className="text-primary">{habit.name}</h3>
        <div className="flex gap-1 text-xs">
          {habit.domain.slice(0, 3).map((d, i) => (
            <Fragment key={d}>
              <span className="flex gap-1 items-center justify-center">
                {lifeDomainList.find((_d) => _d.value === d)?.name}
              </span>
              {i < habit.domain.length - 1 && i < 2 && <span>&bull;</span>}
            </Fragment>
          ))}
        </div>
      </div>
      {(habit.objective || habit.statement) && (
        <div className="flex flex-col gap-y-1">
          {habit.objective && <p>{habit.objective}</p>}
          {habit.statement && (
            <div className="border-s-4 border-s-primary/50 bg-primary/5 ps-2 py-1">
              <p className="italic">
                &ldquo;{habit.statement}&ldquo;{" "}
                {habit.source && <span>&ndash; {habit.source}</span>}
              </p>
            </div>
          )}
        </div>
      )}
      <div className="space-y-3">
        <WeeklyCalendar loggedDates={loggedDates} />
        <div className="flex justify-end">
          <Button>Ghi nhận hôm nay</Button>
        </div>
      </div>
    </div>
  );
}
