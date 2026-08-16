import { CommunityIcon, IntellectualIcon, PlantIcon } from "@/components/icons";
import { BibleIcon } from "@/components/icons/bible";
import { LifeDomainEnum } from "@/helpers/constants";
import { Briefcase, Dumbbell, Heart, LucideIcon } from "lucide-react";
import { SVGProps } from "react";

export const lifeDomainList: {
  value: (typeof LifeDomainEnum)[keyof typeof LifeDomainEnum];
  name: string;
  Icon: LucideIcon | React.FC<SVGProps<SVGSVGElement>>;
}[] = [
  {
    value: "DOMAIN_364",
    name: "Thể chất",
    Icon: Dumbbell,
  },
  {
    value: "DOMAIN_247",
    name: "Mối tương quan",
    Icon: CommunityIcon,
  },
  {
    value: "DOMAIN_584",
    name: "Tâm linh",
    Icon: BibleIcon,
  },
  {
    value: "DOMAIN_953",
    name: "Cảm xúc",
    Icon: Heart,
  },
  {
    value: "DOMAIN_424",
    name: "Trí tuệ",
    Icon: IntellectualIcon,
  },
  {
    value: "DOMAIN_744",
    name: "Môi trường sống",
    Icon: PlantIcon,
  },
  {
    value: "DOMAIN_929",
    name: "Nghề nghiệp",
    Icon: Briefcase,
  },
];
