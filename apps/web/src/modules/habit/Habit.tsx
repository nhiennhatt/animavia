"use client";

import { WeeklyCalendar } from "@/components/common/WeeklyCalendar/WeeklyCalendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";

export function Habit() {
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
            <Card>
              <CardHeader>
                <h3>Thể dục nhẹ buổi sáng</h3>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-2">
                  <p>
                    Khởi đầu ngày mới thật thư thái với 5 đến 15 phút giãn cơ êm
                    ái bên khung cửa sổ phòng.
                  </p>
                  <div className="bg-secondary-container/30 ps-4 pe-2 py-1.5 border-s-4 border-s-secondary/70 box-border text-secondary-container-foreground rounded-e-xs">
                    <q className="text-base text-justify italic">
                      Dịu dàng với cơ thể lúc bình minh, để cả ngày được bao bọc
                      trong sự bình an và dẻo dai.
                    </q>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium text-base">
                    Chặng đường tuần này
                  </h5>
                  <WeeklyCalendar loggedDates={exampleDates} />
                </div>
                <CardAction>
                  <Button>Ghi lại hôm nay</Button>
                </CardAction>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
