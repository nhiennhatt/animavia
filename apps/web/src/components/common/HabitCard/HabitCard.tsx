import { Fragment } from "react/jsx-runtime";
import { EllipsisVertical } from "lucide-react";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";

import { Habit } from "@/types/entities";
import { refreshableQuery } from "@/lib/refreshable-query";
import { lifeDomainList } from "@/config/life-domain-list";
import { getHabitLogs } from "@/services/habit/habit-log.service";

import { Button } from "../../ui/button";
import { WeeklyCalendar } from "../WeeklyCalendar/WeeklyCalendar";
import { HabitCardDropdownMenu } from "./HabitCardDropdownMenu";
import Link from "next/link";

export function HabitCard({
  habit,
  onDelete,
  onLog,
}: {
  habit: Habit & { statement: string | null; source: string | null };
  onDelete: (id: string, name: string) => void;
  onLog: (id: string, time: number, name: string) => void;
}) {
  const today = new Date().setHours(0, 0, 0, 0) / 1000;

  const { data: logs = [] } = useQuery({
    queryKey: ["getHabitLogs", habit.id],
    queryFn: async () => {
      const query = await refreshableQuery(() => getHabitLogs(habit.id));

      if (!query.success) return [];

      return query.data.map((h) => h.forDate);
    },
    refetchOnWindowFocus: false,
  });

  const checkedToday = logs.some((v) => v >= today && v < today + 86400);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        opacity: { duration: 0.5 },
      }}
      key={habit.id}
      className="border border-neutral-100 shadow-sm px-4 py-4 rounded-md flex flex-col justify-between gap-y-7"
    >
      <div>
        <div className="flex">
          <Link
            href={`/habit/${habit.id}`}
            className="flex-1 font-medium font-heading text-2xl max-md:text-xl"
          >
            {habit.name}
          </Link>
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
        <div className="flex gap-1 mt-0.5 text-xs">
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
            <div className="border-s-2 md:border-s-4 border-s-secondary/50 ps-2 md:ps-4 py-1 text-secondary">
              <p className="italic">
                &ldquo;{habit.statement}&ldquo;{" "}
                {habit.source && <span>&ndash; {habit.source}</span>}
              </p>
            </div>
          )}
        </div>
      )}
      <div className="space-y-7">
        <WeeklyCalendar
          onCheckin={(date) => {
            onLog(habit.id, date, habit.name);
          }}
          loggedDates={logs}
        />
        <div className="flex justify-end">
          <Button
            onClick={() => {
              if (!checkedToday)
                onLog(
                  habit.id,
                  Math.trunc(new Date().getTime() / 1000),
                  habit.name,
                );
            }}
            disabled={checkedToday}
            variant="outline"
          >
            Ghi lại hành trình hôm nay
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
