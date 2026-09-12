import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { CompleteHabitButton } from "@/components/common/CompleteHabitButton";
import { LogHabitButton } from "@/components/common/LogHabitButton";
import { Button } from "@/components/ui/button";
import { refreshableQuery } from "@/helpers/funcs/refreshable-query";
import { getHabitLog } from "@/services/habit-log-service";
import { useLogHabit } from "@/store/use-log-habit";

export function LogTodayButton({
  habitId,
  habitName,
  isLog = undefined,
}: {
  habitId: string;
  habitName: string;
  isLog?: boolean;
}) {
  const setLogHabit = useLogHabit((state) => state.setLogHabit);

  const { data: todayLog } = useQuery({
    enabled: isLog === undefined,
    queryKey: ["logs", { habitId, period: "d" }],
    queryFn: async () => {
      const res = await refreshableQuery(() =>
        getHabitLog(habitId, Math.trunc(new Date().getTime() / 1000), "d"),
      );
      if (!res.success) return null;
      return res.data && res.data.length > 0 ? res.data[0] : null;
    },
  });

  const onLog = useCallback(() => {
    setLogHabit({
      habitId,
      habitName,
      forDate: Math.trunc(new Date().getTime() / 1000),
    });
  }, [habitId, habitName]);

  if (isLog === undefined && todayLog === undefined) {
    return <Button variant="ghost">Đang tải...</Button>;
  }

  if (isLog === false || (isLog === undefined && todayLog === null)) {
    return <LogHabitButton onClick={onLog} />;
  }

  return <CompleteHabitButton />;
}
