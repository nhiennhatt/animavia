import { MonthCalendar } from "@/components/common/MothCalendar";
import { refreshableQuery } from "@/helpers/funcs/refreshable-query";
import { useRequiredUser } from "@/hooks/use-required-user";
import { getHabitLog } from "@/services/habit-log-service";
import { useQuery } from "@tanstack/react-query";

export function HabitCalendar({
  habitId,
  habitName,
  habitStartDate,
}: {
  habitId: string;
  habitName: string;
  habitStartDate: string;
}) {
  const user = useRequiredUser();

  const { data: logs } = useQuery({
    queryKey: ["logs", { habitId }],
    queryFn: async () => {
      const res = await refreshableQuery(() =>
        getHabitLog(habitId, Math.trunc(new Date().getTime() / 1000), "M"),
      );

      if (!res.success) return [];

      return res.data;
    },
  });

  if (!logs) return <></>;

  return (
    <div className="daypicker-full-width my-3 w-full max-w-sm mx-auto bg-surface-cream p-2 rounded shadow border border-neutral-100">
      <MonthCalendar
        startDate={habitStartDate}
        habitName={habitName}
        habitId={habitId}
        tz={user.timezone}
        logs={logs.map((l) => l.forDate)}
      />
    </div>
  );
}
