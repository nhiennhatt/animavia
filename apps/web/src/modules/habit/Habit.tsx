"use client";

import { HabitCard } from "@/components/common/HabitCard/HabitCard";
import { Button } from "@/components/ui/button";
import { refreshableQuery } from "@/lib/refreshable-query";
import { deleteHabit, getHabits } from "@/services/habit.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Fragment, useState } from "react";
import z from "zod";
import { DeleteConfirmationDialog } from "./DeleteConfirmation";

export function Habit() {
  const queryClient = useQueryClient();
  const [deletingHabit, setDeletingHabit] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data: habits, isLoading } = useQuery({
    queryKey: ["getOwnedHabits"],
    queryFn: async () => {
      return await refreshableQuery({ hasParams: false, callback: getHabits });
    },
  });

  const { mutate: handleDeleteHabit, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      await refreshableQuery({
        hasParams: true,
        callback: deleteHabit,
        ValidationSchema: z.object({ id: z.uuid() }),
        params: { id },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getOwnedHabits"],
      });
      setDeletingHabit(null);
    },
  });

  const exampleDates = [
    new Date(),
    new Date(),
    new Date(),
    new Date(),
    new Date(),
  ];

  exampleDates[0].setDate(11);
  exampleDates[1].setDate(12);
  exampleDates[2].setDate(14);
  exampleDates[3].setDate(3);

  return (
    <Fragment>
      <div className="flex flex-col items-center w-full">
        <div className="w-full max-w-4xl space-y-16">
          <div className="flex gap-x-4 items-end">
            <div className="space-y-3">
              <h1 className="text-primary">Thói quen hằng ngày</h1>
              <p>
                Nuôi dưỡng sự bình yên qua từng nhịp điệu dịu dàng mỗi ngày. Hãy
                nhẹ nhàng ghi lại những thói quen nhỏ và cùng cảm nhận sự trưởng
                thành nơi tâm hồn bạn.
              </p>
            </div>
            <div>
              <Button className="px-4 py-5 rounded-lg" asChild>
                <Link href="/habit/create">
                  <Plus />
                  Gieo một thói quen
                </Link>
              </Button>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-x-9 gap-y-16">
              {!isLoading &&
                habits?.data &&
                habits.data.map((h) => (
                  <HabitCard
                    key={h.id}
                    habit={h}
                    loggedDates={exampleDates}
                    onDelete={(id, name) => {
                      setDeletingHabit({ id, name });
                    }}
                  />
                ))}
            </div>
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
    </Fragment>
  );
}
