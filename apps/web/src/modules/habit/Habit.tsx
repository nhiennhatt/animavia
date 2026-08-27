"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";

import { HabitCard } from "@/components/common/HabitCard/HabitCard";
import { Button } from "@/components/ui/button";
import { refreshableQuery } from "@/lib/refreshable-query";
import { deleteHabit, getHabits } from "@/services/habit/habit.service";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { DeleteConfirmationDialog } from "./DeleteConfirmation";
import { LogHabitDialog } from "./LogHabitDialog";
import { CompleteEffect } from "./CompleteEffect";
import { logHabit } from "@/services/habit/habit-log.service";

export function Habit() {
  const size = 4;
  const queryClient = useQueryClient();
  const [deletingHabit, setDeletingHabit] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [loggingHabit, setLoggingHabit] = useState<{
    id: string;
    time: number;
    name: string;
  } | null>(null);
  const [page, setPage] = useState<number>(1);
  const [isShowCompleteDialog, setIsShowCompleteDialog] = useState(false);

  const { data: habits = { data: [], total: 0 }, isLoading } = useQuery({
    queryKey: ["getOwnedHabits", size, page],
    queryFn: async () => {
      return (await refreshableQuery(() => getHabits({ page, size }))).data;
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: handleDeleteHabit, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      await refreshableQuery(() => deleteHabit({ id }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getOwnedHabits"],
      });
      setDeletingHabit(null);
    },
  });

  const { mutate: handleLog, isPending: isLogging } = useMutation({
    mutationFn: async (params: {
      id: string;
      date: number;
      thought?: string;
    }) => {
      await refreshableQuery(() =>
        logHabit(params.id, params.date, params.thought),
      );
    },
    onSuccess: (_, variables) => {
      setLoggingHabit(null);
      setIsShowCompleteDialog(true);
      queryClient.invalidateQueries({
        queryKey: ["getHabitLogs", variables.id],
      });
    },
  });

  return (
    <Fragment>
      <div className="flex flex-col items-center w-full px-2 md:px-4 py-5">
        <div className="w-full max-w-4xl space-y-16">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="space-y-3">
              <h1 className="text-primary max-md:text-3xl">
                Thói quen hằng ngày
              </h1>
              <p>
                Nuôi dưỡng sự bình yên qua từng nhịp điệu dịu dàng mỗi ngày. Hãy
                nhẹ nhàng ghi lại những thói quen nhỏ và cùng cảm nhận sự trưởng
                thành nơi tâm hồn bạn.
              </p>
            </div>
            {habits.total < 10 && (
              <div className="self-center">
                <Button className="px-4 py-5 rounded-lg" asChild>
                  <Link href="/habit/create">
                    <Plus />
                    Gieo một thói quen
                  </Link>
                </Button>
              </div>
            )}
          </div>
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-9 gap-y-16">
              <AnimatePresence>
                {!isLoading &&
                  habits?.data &&
                  habits.data.map((h) => (
                    <HabitCard
                      key={h.id}
                      habit={h}
                      onDelete={(id, name) => {
                        setDeletingHabit({ id, name });
                      }}
                      onLog={(id, date, name) => {
                        setLoggingHabit({
                          id,
                          time: date,
                          name: name,
                        });
                      }}
                    />
                  ))}
              </AnimatePresence>
            </div>
            {habits?.total && habits.total > size ? (
              <div className="my-10">
                <Pagination>
                  <PaginationContent>
                    {[...Array(Math.ceil(habits.total / size)).keys()].map(
                      (_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setPage(i + 1)}
                            isActive={i === page - 1}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            ) : (
              <></>
            )}
            {!isLoading && (!habits?.data || habits.data.length <= 0) && (
              <div>
                <p className="text-center">
                  Chưa có thói quen nào cần theo dõi. Hãy tạo thói quen mới.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {deletingHabit && (
        <DeleteConfirmationDialog
          onClose={() => setDeletingHabit(null)}
          onConfirm={() => handleDeleteHabit(deletingHabit.id)}
          name={deletingHabit.name}
        />
      )}
      {loggingHabit && (
        <LogHabitDialog
          isLogging={isLoading}
          onLog={(id, date, thought) => handleLog({ id, date, thought })}
          onClose={() => setLoggingHabit(null)}
          habit={loggingHabit}
        />
      )}
      <CompleteEffect
        isOpen={isShowCompleteDialog}
        onClick={() => setIsShowCompleteDialog(false)}
      />
    </Fragment>
  );
}
