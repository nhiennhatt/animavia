import { Habit } from "@/types/entities";
import { Button } from "../../ui/button";
import { WeeklyCalendar } from "../WeeklyCalendar/WeeklyCalendar";
import { lifeDomainList } from "@/config/life-domain-list";
import { Fragment } from "react/jsx-runtime";
import { EllipsisVertical } from "lucide-react";
import { HabitCardDropdownMenu } from "./HabitCardDropdownMenu";

export function HabitCard({
  habit,
  loggedDates = [],
  onDelete = () => {},
}: {
  habit: Habit & { statement?: string; source?: string };
  loggedDates?: Date[];
  onDelete?: (id: string, name: string) => void;
}) {
  return (
    <div className="border border-neutral-100 shadow-sm px-4 py-4 rounded-md flex flex-col justify-between gap-y-7">
      <div>
        <div className="flex">
          <h3 className="flex-1">{habit.name}</h3>
          <div>
            <HabitCardDropdownMenu
              onDelete={() => onDelete(habit.id, habit.name)}
            >
              <Button
                variant="ghost"
                className="rounded-full outline-none"
                size="icon"
              >
                <EllipsisVertical />
              </Button>
            </HabitCardDropdownMenu>
          </div>
        </div>
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
          {habit.objective && <p className="text-sm">{habit.objective}</p>}
          {habit.statement && (
            <div className="border-s-4 border-s-secondary/50 ps-4 py-1 text-secondary">
              <p className="italic">
                &ldquo;{habit.statement}&ldquo;{" "}
                {habit.source && <span>&ndash; {habit.source}</span>}
              </p>
            </div>
          )}
        </div>
      )}
      <div className="space-y-7">
        <WeeklyCalendar loggedDates={loggedDates} />
        <div className="flex justify-end">
          <Button variant="outline">Ghi nhận hôm nay</Button>
        </div>
      </div>
    </div>
  );
}
