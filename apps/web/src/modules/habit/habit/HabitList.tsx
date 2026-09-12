import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HabitCard } from "@/components/common/HabitCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { getHabits } from "@/services/habit-service";
import { useRequiredUser } from "@/hooks/use-required-user";
import { refreshableQuery } from "@/helpers/funcs/refreshable-query";

const PAGE_SIZE = 4;

export function HabitList() {
  const user = useRequiredUser();
  const [page, setPage] = useState(1);
  const { data: habitsResult } = useQuery({
    queryKey: ["habits", { size: PAGE_SIZE, page, includeLog: true }],
    queryFn: async () => {
      const res = await refreshableQuery(() => getHabits({ size: PAGE_SIZE, page, includeLog: true }));

      if (!res.success) return { data: [], total: 0 };

      return res.data;
    },
  });

  const { habits, total } = useMemo(
    () => ({
      habits: habitsResult ? habitsResult.data : undefined,
      total: habitsResult ? habitsResult.total : 0,
    }),
    [habitsResult],
  );

  return (
    <div className="flex flex-col gap-y-6">
      {habits &&
        habits.map((h) => {
          return <HabitCard tz={user.timezone} habit={h} key={h.id} />;
        })}

      {habits && total > PAGE_SIZE && (
        <div>
          <Pagination>
            <PaginationContent>
              {[...new Array(Math.ceil(total / PAGE_SIZE))].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={i + 1 === page}
                    onClick={() => {
                      if (i + 1 !== page) {
                        setPage(i + 1);
                      }
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
