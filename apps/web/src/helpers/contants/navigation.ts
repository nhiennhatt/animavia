import { HabitIcon } from "@/components/icons/habit-icon";
import { type LucideProps } from "lucide-react";
import { JSX, SVGProps } from "react";

export const SIDEBAR_NAV_ITEMS: {
  name: string;
  path: string;
  isBasePath: boolean;
  Icon: (props: SVGProps<SVGSVGElement> | LucideProps) => JSX.Element;
}[] = [
  { name: "Thói quen", isBasePath: true, path: "/habit", Icon: HabitIcon },
];

export const NAV_SEGMENT_NAMES: Record<string, string> = {
  "/": "Trang chủ",
  "/habit": "Thói quen",
  "/habit/:habitId": ":habitName",
  "/habit/:habitId/setting": "Cài đặt",
};
