import { HabitTypeEnum, LifeDomainEnum } from "../../helpers/contants/app";

export interface Habit {
  id: string;
  name: string;
  objective?: string;
  htype: (typeof HabitTypeEnum)[keyof typeof HabitTypeEnum];
  domain: (typeof LifeDomainEnum)[keyof typeof LifeDomainEnum][];
  ownerId: string;
  weeklyGoal: number;
  pinned: boolean;
  createdAt: string;
}

export interface HabitLog {
  id: string;
  forDate: number;
  habitId: string;
  loggedAt: number;
}

export interface HabitValue {
  id: string;
  name: string;
  value: string;
  habitId: string;
}

export interface HabitStatement {
  id: string;
  habitId: string;
  statement: string;
  source?: string;
}

export interface HabitBackupPlan {
  id: string;
  habitId: string;
  ifCase: string;
  then: string;
}
