"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  CircleCheckBig,
  Pencil,
  Quote,
  Shield,
} from "lucide-react";

import { refreshableQuery } from "@/lib/refreshable-query";
import {
  getHabit,
  getHabitStatements,
  checkLoggedToday,
  logHabit,
} from "@/services/habit.service";
import { Badge } from "@/components/ui/badge";
import { lifeDomainList } from "@/config/life-domain-list";
import { useUser } from "@/hooks/use-user";
import { LogSection } from "./LogSection";
import { LogHabitDialog } from "../LogHabitDialog";
import { CompleteEffect } from "../CompleteEffect";
import { Button } from "@/components/ui/button";
import { dayjs } from "@/lib/dayjs";

export function HabitDetails({ id }: { id: string }) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [isShowCompleteDialog, setIsShowCompleteDialog] =
    useState<boolean>(false);
  const [loggingTime, setLoggingTime] = useState<number | null>(null);

  const { data: habit, isLoading: isLoadingHabit } = useQuery({
    enabled: !!user,
    queryKey: ["getHabit", id],
    queryFn: async () => {
      const result = await refreshableQuery(() => getHabit(id));

      if (!result.success) return null;
      return result.data;
    },
  });

  const { data: statement = [], isLoading: isLoadingStatement } = useQuery({
    enabled: !!habit,
    queryKey: ["randomHabitStatement", id],
    queryFn: async () => {
      const result = await refreshableQuery(() =>
        getHabitStatements({
          habitId: id || "",
          page: 1,
          pageSize: 1,
          random: true,
        }),
      );

      if (result.error) {
        return [];
      } else {
        return result.data;
      }
    },
  });

  const { data: isLoggedToday } = useQuery({
    queryKey: ["checkLoggedToday", id],
    queryFn: async () => {
      const result = await refreshableQuery(() => checkLoggedToday(id));
      if (!result.success) return false;
      return result.data;
    },
  });

  const { mutate: handleLog, isPending: isLogging } = useMutation({
    mutationFn: async (params: { date: number; thought?: string }) => {
      if (!habit) return;
      await refreshableQuery(() =>
        logHabit(habit.id, params.date, params.thought),
      );
    },
    onSuccess: () => {
      setLoggingTime(null);
      setIsShowCompleteDialog(true);
      queryClient.invalidateQueries({
        queryKey: ["monthHabitLog", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["checkLoggedToday", id],
      });
    },
  });

  useEffect(() => {
    if (habit === null) notFound();
  }, [habit, isLoadingHabit]);

  if (isLoadingHabit || !habit) {
    return (
      <div>
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <>
      <div className="my-12 flex flex-col items-stretch gap-y-14 px-1 lg:px-10 max-w-4xl mx-auto w-full">
        <div className="space-y-3 text-center">
          <div className="flex gap-x-2 justify-center py-1">
            {habit.domain.map((d) => {
              const domainConfig = lifeDomainList.find((l) => l.value === d);
              if (!domainConfig) return;
              return (
                <Badge
                  variant="outline"
                  className="p-3.5 md:text-sm"
                  key={`domain-${d}`}
                >
                  <domainConfig.Icon />
                  {domainConfig.name}
                </Badge>
              );
            })}
          </div>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading uppercase">
            {habit.name}
          </p>
          {habit.objective && <p>{habit.objective}</p>}
        </div>
        <div>
          <div className="flex items-center justify-center gap-x-3 max-w-md mx-auto">
            <Button
              size="lg"
              className="flex-1 md:text-base"
              disabled={isLoggedToday === true || isLoadingHabit === undefined}
              onClick={() => setLoggingTime(dayjs().unix())}
            >
              <CircleCheckBig />
              Ghi lại hành trình hôm nay
            </Button>
            <Button variant="outline" size="icon-lg">
              <Pencil />
            </Button>
          </div>
        </div>
        {statement && statement.length > 0 ? (
          <div className="border border-neutral-200 rounded-sm">
            <p className="font-heading italic text-xl text-center p-2 md:p-4">
              <Quote className="text-primary inline mx-2 size-6" />
              &ldquo;{statement[0].statement}&rdquo;
            </p>
          </div>
        ) : (
          <></>
        )}
        {!isLoadingHabit && user ? (
          <LogSection
            user={user}
            habit={habit}
            onLog={(date) => setLoggingTime(date)}
          />
        ) : (
          <></>
        )}
        <div>
          <h3 className="flex items-center gap-x-2 text-xl uppercase">
            <Shield /> Kế hoạch dự phòng
          </h3>
          <div className="mt-3 px-2 flex flex-col gap-y-3">
            <div className="border border-neutral-300 rounded-sm p-1.5 md:p-3 flex gap-x-2 items-center text-lg">
              <ArrowRight className="text-primary size-4" />
              <p>
                <span className="text-primary font-semibold">Nếu</span> tôi dậy
                trễ, <span className="font-semibold text-tertiary">Thì</span>{" "}
                tôi phải hít thở vào giờ trưa.
              </p>
            </div>
            <div className="border border-neutral-300 rounded-sm p-1.5 md:p-3 flex gap-x-2 items-center text-lg">
              <ArrowRight className="text-primary size-4" />
              <p>
                <span className="text-primary font-semibold">Nếu</span> tôi dậy
                trễ, <span className="font-semibold text-tertiary">Thì</span>{" "}
                tôi phải hít thở vào giờ trưa.
              </p>
            </div>
          </div>
        </div>
      </div>
      {habit && loggingTime && (
        <LogHabitDialog
          isLogging={isLogging}
          onClose={() => {
            setLoggingTime(null);
          }}
          onLog={(_, time, thought) => {
            handleLog({ date: time, thought });
          }}
          habit={{ id: habit.id, name: habit.name, time: loggingTime }}
        />
      )}
      <CompleteEffect
        isOpen={isShowCompleteDialog}
        onClick={() => setIsShowCompleteDialog(false)}
      />
    </>
  );
}
