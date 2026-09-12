"use client";

import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { lifeDomainConfig } from "@/helpers/contants/life-domain-config";
import { refreshableQuery } from "@/helpers/funcs/refreshable-query";
import { getHabit } from "@/services/habit-service";
import { useDynamicSegment } from "@/store/use-dynamic-segment";
import { LogTodayButton } from "./LogTodayButton";
import { HabitValues } from "./HabitValues";
import { HabitCalendar } from "./HabitCalendar";
import { HabitStatement } from "./HabitStatement";
import { HabitBackupPlan } from "./HabitBackUpPlan";

export function HabitDetails({ id }: { id: string }) {
  const segment = useDynamicSegment((state) => state.dynamicSegment);
  const setSegment = useDynamicSegment((state) => state.setDynamicSegment);

  const { data: habit, isLoading: isLoadingHabit } = useQuery({
    queryKey: ["habit", { id }],
    queryFn: async () => {
      const res = await refreshableQuery(() => getHabit(id));
      if (!res.success) return null;
      return res.data;
    },
  });

  useEffect(() => {
    if (habit) {
      setSegment({ ...segment, ":habitName": habit.name });

      return () => {
        const { ":habitName": _, ...segs } = segment;
        setSegment(segs);
      };
    }
  }, [habit]);

  if (habit === undefined) {
    return (
      <>
        <Spinner className="size-12 self-center my-auto" />
      </>
    );
  }

  if (habit === null) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-y-8 max-w-4xl self-center w-full py-10 px-3 md:px-6">
      <div className="bg-surface-cream border border-accent shadow rounded overflow-hidden">
        <div className="p-4 md:p-6">
          <div className="flex gap-x-2 uppercase font-heading">
            {habit.domain.map((d) => (
              <Badge
                style={{
                  backgroundColor: lifeDomainConfig[d].background,
                  color: lifeDomainConfig[d].foreground,
                }}
                className="py-1"
                key={d}
              >
                {lifeDomainConfig[d].name}
              </Badge>
            ))}
            <Badge
              variant="outline"
              className="text-primary bg-background py-1"
            >
              {habit.weeklyGoal} ngày / tuần
            </Badge>
          </div>
          <div className="flex max-md:flex-col gap-x-3">
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-sans py-2">
                {habit.name}
              </h1>
              {habit.objective && (
                <p className="text-base">{habit.objective}</p>
              )}
            </div>
            <div className="py-3">
              <LogTodayButton habitId={habit.id} habitName={habit.name} />
            </div>
          </div>
        </div>
        <HabitValues habitId={id} />
      </div>
      <HabitCalendar
        habitId={id}
        habitName={habit.name}
        habitStartDate={habit.createdAt}
      />
      <HabitStatement habitId={id} />
      <HabitBackupPlan habitId={id} />
    </div>
  );
}
