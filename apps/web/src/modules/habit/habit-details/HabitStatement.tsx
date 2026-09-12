import { refreshableQuery } from "@/helpers/funcs/refreshable-query";
import { getHabitStatement } from "@/services/habit-statement-service";
import { useQuery } from "@tanstack/react-query";
import { Quote } from "lucide-react";

export function HabitStatement({ habitId }: { habitId: string }) {
  const { data: statement } = useQuery({
    queryKey: ["statement", { habitId, random: true }],
    queryFn: async () => {
      const res = await refreshableQuery(() =>
        getHabitStatement({ habitId, pageSize: 1, random: 1 }),
      );

      if (!res.success || !res.data || res.data.length === 0) return null;
      return res.data[0];
    },
    refetchOnWindowFocus: false,
  });

  if (!statement) return <></>;

  return (
    <div className="bg-surface-cream border border-neutral-200 rounded-sm p-3 md:p-6 md:px-8 flex gap-x-2 md:gap-x-6 items-baseline">
      <Quote className="text-primary opacity-50 size-4 md:size-6" />
      <div className="flex flex-col gap-y-2">
        <q className="text-xl md:text-3xl italic font-normal">
          {statement.statement}
        </q>
        {statement.source && (
          <span className="font-heading font-medium text-sm">
            &mdash; {statement.source}
          </span>
        )}
      </div>
    </div>
  );
}
