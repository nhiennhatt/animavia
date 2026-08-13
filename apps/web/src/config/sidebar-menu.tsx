import { CandleIcon, CardsIcon } from "@/components/icons";
import {
  BookHeart,
  Calendar,
  Grid2X2,
  HeartPlus,
  TentTree,
  Ticket,
  Users,
} from "lucide-react";
import { SVGProps, JSX } from "react";

export const sidebarMenuItems = [
  "examen",
  "diary",
  "dailyCard",
  "events",
  "communities",
  "outdoor",
  "supportCenter",
  "SWOT",
] as const;

export const sidebarMenu: Record<
  (typeof sidebarMenuItems)[number],
  {
    icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    href: string;
    name: string;
  }
> = {
  examen: {
    icon: CandleIcon,
    href: "#",
    name: "Hồi tâm",
  },
  diary: {
    icon: (props: SVGProps<SVGSVGElement>) => <BookHeart {...props} />,
    href: "/diary",
    name: "Nhật ký",
  },
  dailyCard: {
    icon: CardsIcon,
    href: "#",
    name: "Thẻ Phục hồi",
  },
  events: {
    icon: (props: SVGProps<SVGSVGElement>) => <Ticket {...props} />,
    href: "#",
    name: "Sự kiện",
  },
  communities: {
    icon: (props: SVGProps<SVGSVGElement>) => <Users {...props} />,
    href: "#",
    name: "Cộng đoàn",
  },
  outdoor: {
    icon: (props: SVGProps<SVGSVGElement>) => <TentTree {...props} />,
    href: "#",
    name: "Trạm ý tưởng",
  },
  supportCenter: {
    icon: (props: SVGProps<SVGSVGElement>) => <HeartPlus {...props} />,
    href: "#",
    name: "Góc lắng nghe",
  },
  SWOT: {
    icon: (props: SVGProps<SVGSVGElement>) => <Grid2X2 {...props} />,
    href: "#",
    name: "SWOT",
  },
} as const;
