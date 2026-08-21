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

export interface Statement {
  id: string;
  statement: string;
  source: string | null;
  habitId: string;
}

export interface HabitLog {
  id: string;
  loggedAt: Date;
  forDate: number;
  thought: string | null;
  habitId: string;
}
