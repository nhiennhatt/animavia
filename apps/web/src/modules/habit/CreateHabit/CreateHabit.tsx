"use client";

import z from "zod";
import Link from "next/link";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  createHabitStatementSchema,
  createHabitSchema,
  SteppedCreateHabitSchema,
  CreateHabitSchema,
} from "@/validations/habit.validation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormDataContext } from "./context/form-data-context";
import { cn } from "@/lib/utils";
import { createHabitStepConfig } from "@/config/create-habit-steps-config";
import { useUser } from "@/hooks/use-user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addHabitStatement, createHabit } from "@/services/habit.service";
import { useRouter } from "next/navigation";
import { refreshableQuery } from "@/lib/refreshable-query";
import { Habit } from "@/types/entities";

export function CreateHabit() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, loading } = useUser();
  const [formData, setFormData] = useState<SteppedCreateHabitSchema>({
    name: "",
    domain: [],
    weekly: 1,
    htype: "HTYPE_235",
  });
  const [stepNumber, setStepNumber] = useState<number>(0);
  const [error, setError] = useState<
    Partial<Record<keyof SteppedCreateHabitSchema, [string]>>
  >({});

  const { mutate: handleCreateHabit, isPending } = useMutation({
    mutationFn: async (body: SteppedCreateHabitSchema) => {
      const creationResult = await refreshableQuery(() => createHabit(body));

      if (!creationResult.success) throw creationResult.error;

      if (!!body.statement && !!body.statement?.statement) {
        const statementCreationResult = await refreshableQuery(() =>
          addHabitStatement({
            habitId: creationResult.data.id,
            statement: body.statement?.statement || "",
            source: body.statement?.source,
          }),
        );
      }

      return creationResult.data.id;
    },
    onError: (e) => {
      console.log(e);
    },
    onSuccess: (id: string) => {
      queryClient.invalidateQueries({ queryKey: ["getOwnedHabits"] });
      console.log(id);
      router.push(`/habit`);
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Vui lòng đăng nhập</div>;
  }

  const currentStep = createHabitStepConfig[stepNumber];

  const nextStep = useCallback(
    (isSkip: boolean = false) => {
      setError({});
      if (!(isSkip && currentStep.skippable)) {
        const validate = currentStep.validateSchame.safeParse(formData);
        if (!validate.success) {
          setError(z.flattenError(validate.error).fieldErrors);
          return;
        }
        setFormData({ ...formData, ...validate.data });
      } else {
        setFormData({
          ...formData,
          ...Object.fromEntries(
            Object.keys(currentStep.validateSchame.def.shape).map((k) => [
              k,
              undefined,
            ]),
          ),
        });
      }
      if (stepNumber === createHabitStepConfig.length - 1) return;

      if (
        !!formData.htype &&
        !!createHabitStepConfig[stepNumber + 1].onlyFor &&
        createHabitStepConfig[stepNumber + 1].onlyFor !== formData.htype
      ) {
        setStepNumber(stepNumber + 2);
      } else {
        setStepNumber(stepNumber + 1);
      }
    },
    [currentStep, stepNumber, formData],
  );

  const previousStep = () => {
    if (stepNumber === 0) return;

    if (
      !!formData.htype &&
      !!createHabitStepConfig[stepNumber - 1].onlyFor &&
      createHabitStepConfig[stepNumber - 1].onlyFor !== formData.htype
    ) {
      setStepNumber(stepNumber - 2);
    } else {
      setStepNumber(stepNumber - 1);
    }
  };

  return (
    <div className="flex items-center justify-center px-2">
      <div className="max-w-xl w-full space-y-10 my-10 mb-32">
        <Button variant="outline" asChild>
          <Link href="/habit">
            <ArrowLeft />
            Quay lại
          </Link>
        </Button>
        <div>
          <h1 className="text-center text-primary max-md:text-3xl">
            Gieo mầm thói quen
          </h1>
          <p className="text-center text-lg">
            Một bước nhỏ trên hành trình lớn lên.
          </p>
        </div>

        <div className="relative flex justify-between items-center mx-auto max-w-lg w-full">
          <div className="absolute left-0 right-0 top-1/2 flex justify-center border border-neutral-300 z-10"></div>
          {createHabitStepConfig.map((_, i) => (
            <span
              key={i}
              className={cn(
                "rounded-full z-10 size-10  border border-accent flex items-center justify-center select-none",
                i <= stepNumber
                  ? "bg-primary text-primary-foreground"
                  : "bg-white",
              )}
            >
              {i + 1}
            </span>
          ))}
        </div>
        <FormDataContext.Provider value={[formData, setFormData, error]}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={`${stepNumber}`}
            onKeyUp={(e) => {
              if (!e.shiftKey && e.key === "Enter") {
                nextStep();
              }
            }}
          >
            {!currentStep.endStep && (
              <Card>
                <CardHeader>
                  <h4 className="text-2xl font-medium">{currentStep.name}</h4>
                  <p>{currentStep.description}</p>
                </CardHeader>
                <CardContent>{<currentStep.Form />}</CardContent>
              </Card>
            )}
            {currentStep.endStep && <div>{<currentStep.Form />}</div>}
          </motion.div>
        </FormDataContext.Provider>
        <div>
          {stepNumber > 0 && (
            <Button
              onClick={previousStep}
              variant="outline"
              className="float-start"
              disabled={isPending}
            >
              <ArrowLeft />
              Quay lại
            </Button>
          )}
          <div className="float-end space-x-2">
            {currentStep.skippable && (
              <Button
                disabled={isPending}
                variant="outline"
                onClick={() => nextStep(true)}
              >
                Bỏ qua
              </Button>
            )}
            {stepNumber < createHabitStepConfig.length - 1 && (
              <Button disabled={isPending} onClick={() => nextStep()}>
                Tiếp tục
                <ArrowRight />
              </Button>
            )}
            {stepNumber === createHabitStepConfig.length - 1 && (
              <Button
                disabled={isPending}
                onClick={() => handleCreateHabit(formData)}
              >
                <Save />
                Hoàn tất
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
