"use client";

import { useEffect } from "react";
import { notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { refreshableQuery } from "@/lib/refreshable-query";
import { getHabit } from "@/services/habit.service";
import { Badge } from "@/components/ui/badge";
import { lifeDomainList } from "@/config/life-domain-list";
import { ArrowRight, CircleCheckBig, Leaf, Pencil, Quote, Shield } from "lucide-react";
import { LogCalendar } from "./LogCalendar";
import { dayjs } from "@/lib/dayjs";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";

export function HabitDetails({ id }: { id: string }) {
  const { user } = useUser();

  const { data: habit, isLoading: isLoadingHabit } = useQuery({
    queryKey: ["getHabit", id],
    queryFn: async () => {
      const result = await refreshableQuery(() => getHabit(id));

      if (!result.success) return null;
      return result.data;
    },
  });

  useEffect(() => {
    if (!habit && !isLoadingHabit) notFound();
  }, [habit, isLoadingHabit]);

  if (isLoadingHabit || !habit) {
    return (
      <div>
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className="my-4 flex flex-col items-stretch gap-y-14 px-1 lg:px-10 max-w-4xl mx-auto w-full">
      <div className="space-y-3 text-center">
        <div className="flex gap-x-2 justify-center">
          {habit.domain.map((d) => {
            const domainConfig = lifeDomainList.find((l) => l.value === d);
            if (!domainConfig) return;
            return (
              <Badge
                className="py-2.5 px-3 md:text-sm text-secondary bg-secondary-container"
                key={`domain-${d}`}
              >
                <domainConfig.Icon />
                {domainConfig.name}
              </Badge>
            );
          })}
        </div>
        <p className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading uppercase">
          {habit.name}
        </p>
        {habit.objective && <p>{habit.objective}</p>}
      </div>
      <div className="flex gap-x-2 justify-center">
        <Button size="lg" className="px-10 text-lg">
          <CircleCheckBig />
          Ghi lại hành trình
        </Button>
        <Button variant="outline" size="icon-lg">
          <Pencil />
        </Button>
      </div>
      <div className="border border-neutral-200 rounded-sm ">
        <p className="font-heading italic text-xl text-center p-2 md:p-5">
          <Quote className="text-primary inline mx-2 size-6" />
          &ldquo;Cảm xúc thường gợn sóng như mặt hồ, và hơi thở sâu chính là hòn
          đá neo giữ cho tâm trí bạn không bị cuốn trôi theo bão giông.&rdquo;
        </p>
        <div className="p-2 md:p-5 space-y-2">
          <div className="flex gap-2 flex-wrap justify-center">
            <Badge className="text-primary bg-primary/5 border-primary/10 border text-sm py-2 px-3 rounded-sm">
              Dành thời gian cho chính mình
            </Badge>
            <Badge className="text-primary bg-primary/5 border-primary/10 border text-sm py-2 px-3 rounded-sm">
              Dọn dẹp suy nghĩ
            </Badge>
            <Badge className="text-primary bg-primary/5 border-primary/10 border text-sm py-2 px-3 rounded-sm">
              Thư giãn cơ thể
            </Badge>
            <Badge className="text-primary bg-primary/5 border-primary/10 border text-sm py-2 px-3 rounded-sm">
              Tỉnh táo
            </Badge>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 md:px-1">
        <div className="p-1 md:p-5 md:pe-10">
          <LogCalendar habit={habit} />
        </div>
        <div className="lg:border-s lg:border-s-accent p-1 md:p-3 md:ps-6 flex flex-col gap-y-3">
          <h3 className="flex items-center gap-x-2 text-xl uppercase">
            <Leaf /> Nhật ký thói quen
          </h3>
          <div className="flex flex-col gap-y-4">
            <div>
              <h4 className="text-primary text-sm font-medium">
                &#9679; {dayjs().tz(user?.timezone).format("D MMM, YYYY")}
              </h4>
              <p className="ps-3 line-clamp-4 overflow-hidden text-justify">
                Hôm nay mình đã dành 3 phút hít thở sâu, mình cảm nhận rõ nhịp
                đập của trái tim và sự bình yên.
              </p>
            </div>
            <div>
              <h4 className="text-primary text-sm font-medium">
                &#9679; {dayjs().tz(user?.timezone).format("D MMM, YYYY")}
              </h4>
              <p className="ps-3 line-clamp-3 overflow-hidden text-justify">
                Sau khi thức dậy, mình đã hít thở sâu 5 nhịp để kích hoạt sự
                tỉnh táo cho ngày mới.
              </p>
            </div>
            <div>
              <h4 className="text-primary text-sm font-medium">
                &#9679; {dayjs().tz(user?.timezone).format("D MMM, YYYY")}
              </h4>
              <p className="ps-3 line-clamp-3 overflow-hidden text-justify">
                Đã hít thở sâu ngoài ban công. Khởi đầu một ngày mới với tâm
                trạng thực sự nhẹ nhàng.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="flex items-center gap-x-2 text-xl uppercase">
          <Shield /> Kế hoạch dự phòng
        </h3>
        <div className="mt-3 px-2 flex flex-col gap-y-3">
          <div className="border border-neutral-200 rounded-sm p-1.5 md:p-3 flex gap-x-2 items-center text-lg">
            <ArrowRight className="text-primary size-4"/>
            <p>
              <span className="text-primary font-semibold">Nếu</span> tôi dậy
              trễ, <span className="font-semibold text-tertiary">Thì</span> tôi
              phải hít thở vào giờ trưa.
            </p>
          </div>
          <div className="border border-neutral-200 rounded-sm p-1.5 md:p-3 flex gap-x-2 items-center text-lg">
            <ArrowRight className="text-primary size-4"/>
            <p>
              <span className="text-primary font-semibold">Nếu</span> tôi dậy
              trễ, <span className="font-semibold text-tertiary">Thì</span> tôi
              phải hít thở vào giờ trưa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
