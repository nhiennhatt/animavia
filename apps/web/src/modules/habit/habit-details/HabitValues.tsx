import { Separator } from "@/components/ui/separator";
import { refreshableQuery } from "@/helpers/funcs/refreshable-query";
import { getHabitValues } from "@/services/habit-value-service";
import { useQuery } from "@tanstack/react-query";
import { Clover } from "lucide-react";

export function HabitValues({ habitId }: { habitId: string }) {
  const { data: habitValues } = useQuery({
    queryKey: ["values", { habitId }],
    queryFn: async () => {
      const res = await refreshableQuery(() => getHabitValues(habitId));
      return !res.success ? [] : res.data;
    },
    refetchOnWindowFocus: false,
  });

  if (!habitValues || habitValues.length === 0) return <></>;

  return (
    <>
      <Separator />
      <div className="p-4 md:p-6 bg-gray-50">
        <div className="flex max-md:flex-col justify-between items-baseline py-2">
          <h1 className="uppercase flex gap-x-1 items-center">
            <Clover className="size-5" /> Giá trị cốt lõi
          </h1>
          <p className="text-xs font-extralight font-heading text-neutral-500 capitalize">
            Bắt đầu có chủ đích
          </p>
        </div>
        <div className="flex gap-4 flex-wrap justify-center max-md:flex-col">
          {habitValues &&
            habitValues.map((v) => (
              <div
                key={v.id}
                className="basis-[calc(50%-0.5rem)] space-y-1.5 bg-surface-cream py-5 rounded border border-neutral-200"
              >
                <h1 className="text-xl font-sans capitalize px-3 md:px-4.5">
                  &#8226; {v.name}
                </h1>
                <p className="text-sm text-justify px-4 md:px-6.5">{v.value}</p>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
