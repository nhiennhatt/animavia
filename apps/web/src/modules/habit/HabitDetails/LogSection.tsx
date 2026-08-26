import { Leaf } from "lucide-react";

import { dayjs } from "@/lib/dayjs";
import { Habit } from "@/types/entities";
import { BaseUser } from "@/types/user";
import { Skeleton } from "@/components/ui/skeleton";
import { LogCalendar } from "./LogCalendar";
import { DayPickerProps } from "react-day-picker";
import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getHabitLogs } from "@/services/habit/habit-log.service";

export function LogSection({
  habit,
  user,
  onLog,
}: {
  habit: Habit;
  user: BaseUser;
  onLog: (date: number) => void;
}) {
  const [month, setMonth] = useState<Date>(new Date());
  const { data: logs = [], isLoading: isLoadingLogs } = useQuery({
    enabled: !!habit,
    queryKey: [
      "monthHabitLog",
      habit.id,
      dayjs(month).tz(user?.timezone).format("YYYY-MM"),
    ],
    queryFn: async () => {
      const res = await getHabitLogs(
        habit.id,
        Math.trunc(month.getTime() / 1000),
        "m",
      );
      if (res.error || !res.data) return [];

      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const hasThoughtLogs = logs.filter((l) => !!l.thought);

  const handleOnClickDay: DayPickerProps["onDayClick"] = useCallback((d, m) => {
    const userTz = user?.timezone;
    if (m.logged || m.disabled) return;
    if (
      dayjs().tz(userTz).isSame(d, "day") || // is Today?
      (dayjs().tz(userTz).subtract(1, "d").isSame(d, "day") &&
        dayjs()
          .tz(userTz)
          .isBefore(dayjs().tz(userTz).hour(7).minute(0).second(0))) // and current is Before 7 a.m?
    ) {
      onLog(Math.trunc(d.getTime() / 1000));
    }
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 md:px-1 relative">
      <div className="p-1 md:p-5 md:pe-10">
        {!isLoadingLogs ? (
          <LogCalendar
            habit={habit}
            logs={logs}
            user={user}
            month={month}
            setMonth={setMonth}
            onClickDay={handleOnClickDay}
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {[...new Array(30)].map((_, i) => (
              <Skeleton key={i} className="size-6 rounded-sm" />
            ))}
          </div>
        )}
      </div>
      <div className="lg:border-s lg:border-s-accent relative">
        <div className="absolute inset-0 max-h-full flex flex-col gap-y-3 p-1 md:p-3 md:ps-6">
          <h3 className="flex items-center gap-x-2 text-xl uppercase">
            <Leaf /> Nhật ký thói quen
          </h3>
          <div className="overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent flex flex-col gap-y-3">
            {hasThoughtLogs.length > 0 ? (
              hasThoughtLogs.map((l) => (
                <div key={l.id}>
                  <h4 className="text-primary text-sm font-medium">
                    &#9679;{" "}
                    {dayjs
                      .unix(l.forDate)
                      .tz(user.timezone)
                      .format("D MMM, YYYY")}
                  </h4>
                  <p className="ps-3 overflow-hidden text-justify">
                    {l.thought}
                  </p>
                </div>
              ))
            ) : !isLoadingLogs ? (
              <div>
                <p>
                  Bạn không có nhật ký nào trong tháng{" "}
                  {dayjs(month).format("MM - YYYY")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Skeleton className="h-4 max-w-8" />
                <Skeleton className="h-4 max-w-10" />
                <Skeleton className="h-4 max-w-4" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
