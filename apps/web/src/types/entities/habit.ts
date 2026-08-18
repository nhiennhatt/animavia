import { HabitTypeEnum, LifeDomainEnum } from "@/helpers/constants";

export interface Habit {
  id: string;
  name: string;
  objective: string | null;
  htype: (typeof HabitTypeEnum)[keyof typeof HabitTypeEnum];
  domain: (typeof LifeDomainEnum)[keyof typeof LifeDomainEnum][];
  ownerId: string;
  weeklyGoal: number;
  pinned: boolean;
  createdAt: Date;
}
