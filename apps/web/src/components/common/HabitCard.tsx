import { useMemo } from "react";
import { BadgeCheck, Circle } from "lucide-react";
import Link from "next/link";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { WeekCalendar } from "./WeekCalendar";
import { Habit } from "@/libs/entities/habit-entity";
import { lifeDomainConfig } from "@/helpers/contants/life-domain-config";
import { useLogHabit } from "@/store/use-log-habit";
import { getTodayUnix } from "@/libs/utils/day";
import { LogHabitButton } from "./LogHabitButton";
import { CompleteHabitButton } from "./CompleteHabitButton";
import { LogTodayButton } from "@/modules/habit/habit-details/LogTodayButton";

export function HabitCard({
  habit,
  tz,
}: {
  habit: Habit & { logs: number[] };
  tz: string;
}) {
  const setLogHabit = useLogHabit((state) => state.setLogHabit);
  const onLog = (forDate: number) => {
    setLogHabit({ habitId: habit.id, habitName: habit.name, forDate });
  };

  const isLoggedToday = useMemo(() => {
    const todayUnix = getTodayUnix(tz);
    return habit.logs.some((unix) => unix === todayUnix);
  }, [habit.logs]);

  return (
    <div className="bg-surface-cream p-3 md:p-5 rounded border border-neutral-300 flex flex-col gap-y-3.5 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-y-1">
        <div className="flex gap-2">
          {habit.domain.map((d) => (
            <span
              key={d}
              style={{
                color: lifeDomainConfig[d].foreground,
                background: lifeDomainConfig[d].background,
              }}
              className="px-2.5 py-0.5 rounded-lg text-sm font-normal shadow-xs cursor-default"
            >
              {lifeDomainConfig[d].name}
            </span>
          ))}
        </div>
        <div className="flex max-md:flex-col gap-3 items-stretch md:items-start">
          <div className="flex-1">
            <Link href={`/habit/${habit.id}`}>
              <h1 className="text-2xl font-sans cursor-pointer">
                {habit.name}
              </h1>
            </Link>
            {habit.objective && (
              <p className="text-sm my-2 max-w-lg">{habit.objective}</p>
            )}
          </div>
          <div className="">
            <LogTodayButton
              habitId={habit.id}
              habitName={habit.name}
              isLog={isLoggedToday}
            />
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex justify-between gap-2 items-center max-md:flex-col-reverse max-md:items-stretch">
        <div className="max-w-3xs">
          <WeekCalendar tz={tz} logs={habit.logs} onLog={onLog} />
        </div>
        <div>
          <p className="font-mono text-xs">
            {habit.logs.length}/{habit.weeklyGoal} mục tiêu hoàn tất
          </p>
        </div>
      </div>
    </div>
  );
}
