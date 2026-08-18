"use client";

import { HabitCard } from "@/components/common/HabitCard";
import { Button } from "@/components/ui/button";
import { getHabits } from "@/services/habit.service";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";

export function Habit() {
  const { data: habits, isLoading } = useQuery({
    queryKey: ["getOwnedHabits"],
    queryFn: async () => {
      const result = await getHabits();
      return result;
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
            <Button className="px-4 py-5" asChild>
              <Link href="/habit/create">
                <Plus />
                Gieo một thói quen
              </Link>
            </Button>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-8">
            {!isLoading &&
              habits?.data &&
              habits.data.map((h) => (
                <HabitCard key={h.id} habit={h} loggedDates={exampleDates} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
