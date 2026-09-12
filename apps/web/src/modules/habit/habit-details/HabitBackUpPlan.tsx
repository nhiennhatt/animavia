import { Badge } from "@/components/ui/badge";
import { refreshableQuery } from "@/helpers/funcs/refreshable-query";
import { getHabitBackupPlan } from "@/services/habit-backup-plan-service";
import { useQuery } from "@tanstack/react-query";
import { Info, Shield } from "lucide-react";

export function HabitBackupPlan({ habitId }: { habitId: string }) {
  const { data: backupPlans } = useQuery({
    queryKey: ["backupPlans", { habitId }],
    queryFn: async () => {
      const res = await refreshableQuery(() => getHabitBackupPlan(habitId));

      if (!res.success || !res.data) return [];

      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  if (!backupPlans || backupPlans.length === 0) return <></>;

  return (
    <div>
      <div className="pb-2">
        <p className="text-xs font-heading uppercase font-medium text-primary">
          Trở lại quỹ đạo
        </p>
        <h1 className="capitalize text-2xl font-sans">Phương án dự phòng</h1>
      </div>
      <div className="flex flex-col py-2">
        {backupPlans.map((p) => (
          <div
            key={p.id}
            className="bg-surface-cream py-3 px-3 md:px-8 rounded-sm shadow flex flex-col gap-y-2 border-s-3 border-s-primary/80"
          >
            <div className="flex gap-x-1 md:gap-x-2 items-baseline">
              <Info className="size-3.5" />
              <span className="rounded-xs font-bold uppercase text-xs font-heading py-1.5 px-2 bg-neutral-200">
                Nếu
              </span>
              <span className="font-normal max-md:text-sm">{p.ifCase}</span>
            </div>
            <div className="flex gap-x-1 md:gap-x-2 items-baseline">
              <Shield className="size-3.5" />
              <span className="rounded-xs font-bold uppercase text-xs font-heading py-1.5 px-2 bg-primary-fixed/80">
                Thì
              </span>
              <span className="font-normal max-md:text-sm">{p.then}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
