"use client";

import Link from "next/link";
import { Lightbulb, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { lifeDomainConfig } from "@/helpers/contants/life-domain-config";
import { HabitList } from "./HabitList";

export function Habits() {
  return (
    <div className="max-w-4xl w-full mx-auto px-2 md:px-4 py-8 flex flex-col gap-y-12">
      <div className="space-y-3">
        <h1 className="text-2xl lg:text-4xl">Thói quen hằng ngày</h1>
        <div className="flex gap-2 max-md:flex-col">
          <p className="text-sm">
            Mỗi nỗ lực nhỏ đều đáng giá. Đánh dấu để ghi nhận nỗ lực của bản
            thân theo nhịp riêng—không cần vội, chỉ cần đều.
          </p>
          <Button size="lg" className="rounded" asChild>
            <Link href="/habit">
              <Plus />
              Bắt đầu thói quen mới
            </Link>
          </Button>
        </div>
      </div>
      <Item variant="outline" className="bg-surface-cream rounded-sm">
        <ItemMedia>
          <Lightbulb className="text-primary" />
        </ItemMedia>
        <ItemContent>
          <ItemHeader>
            <ItemTitle className="text-primary *:font-medium">
              <span>Mẹo nhỏ</span>
              <span>&bull;</span>
              <span>Ghép thói quen</span>
            </ItemTitle>
          </ItemHeader>
          <ItemDescription className="line-clamp-none font-light">
            Neo thói quen mới vào một nhịp sinh hoạt sẵn có (ví dụ: đọc 2 trang
            sách ngay sau khi pha cà phê sáng) để việc bắt tay vào làm trở nên
            thật nhẹ nhàng.
          </ItemDescription>
        </ItemContent>
      </Item>
      <div>
        <div className="flex gap-1 md:gap-2 flex-wrap">
          <Button variant="default" className="md:px-4 max-md:text-xs">
            Tất cả
          </Button>
          {Object.entries(lifeDomainConfig).map(([value, config]) => (
            <Button
              key={value}
              variant="outline"
              className="md:px-4 max-md:text-xs font-light"
            >
              {config.name}
            </Button>
          ))}
        </div>
      </div>
      <HabitList />
    </div>
  );
}
