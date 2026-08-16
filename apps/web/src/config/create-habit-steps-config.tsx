import { HabitTypeEnum } from "@/helpers/constants";
import { ReviewStep } from "@/modules/habit/CreateHabit/ReviewStep";
import { StepFour } from "@/modules/habit/CreateHabit/StepFour";
import { StepOne } from "@/modules/habit/CreateHabit/StepOne";
import { StepThree } from "@/modules/habit/CreateHabit/StepThree";
import { StepTwo } from "@/modules/habit/CreateHabit/StepTwo";
import { steppedCreateHabitSchema } from "@/validations/habit.validation";
import { JSX } from "react/jsx-runtime";
import z from "zod";

export const createHabitStepConfig: {
  name: string;
  description: string;
  Form: () => JSX.Element;
  validateSchame: z.ZodObject;
  onlyFor?: (typeof HabitTypeEnum)[keyof typeof HabitTypeEnum];
  skippable?: boolean;
  endStep?: boolean;
}[] = [
  {
    name: "Thông tin ban đầu",
    description:
      "Hãy gọi tên và xác định rõ mục tiêu cho thói quen mới để từng bước kiên trì trở nên dễ dàng",
    Form: StepOne,
    validateSchame: steppedCreateHabitSchema.pick({
      name: true,
      objective: true,
      htype: true,
    }),
  },
  {
    name: "Nhóm thói quen*",
    description: "Bạn muốn dành thói quen này cho khía cạnh nào của cuộc sống?",
    Form: StepTwo,
    validateSchame: steppedCreateHabitSchema.pick({
      domain: true,
    }),
  },
  {
    name: "Chỉ tiêu trong tuần",
    description: "Thiết lập nhịp độ phù hợp cho mỗi tuần.",
    Form: StepThree,
    validateSchame: steppedCreateHabitSchema.pick({
      weekly: true,
    }),
    onlyFor: "HTYPE_235",
  },
  {
    name: "Lời nhắc nhở bản thân",
    description: "Một chút động lực nhỏ để bạn vững bước mỗi ngày.",
    Form: StepFour,
    validateSchame: steppedCreateHabitSchema
      .pick({ statement: true })
      .required(),
    skippable: true,
  },
  {
    name: "Review Step",
    description: "Review Step",
    validateSchame: steppedCreateHabitSchema,
    Form: ReviewStep,
    endStep: true,
  },
] as const;
