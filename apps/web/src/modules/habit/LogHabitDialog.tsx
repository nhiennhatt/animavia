import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { TextAnimate } from "@/components/ui/text-animate";
import { Textarea } from "@/components/ui/textarea";
import { habitThoughtReflections } from "@/config/habit-thought-reflection";

export function LogHabitDialog({
  habit,
  isLogging,
  onLog,
  onClose,
}: {
  habit: { id: string; name: string; time: number };
  isLogging: boolean;
  onLog: (id: string, time: number, thought: string) => unknown;
  onClose: () => void;
}) {
  const [reflectionLabel, setReflectionLabel] = useState<string>(
    habitThoughtReflections[0],
  );
  const [thought, setThought] = useState<string>("");

  useEffect(() => {
    const refreshReflectionLabel = setInterval(() => {
      setReflectionLabel(
        habitThoughtReflections[
          Math.trunc(Math.random() * habitThoughtReflections.length)
        ],
      );
    }, 8000);

    return () => clearInterval(refreshReflectionLabel);
  }, []);

  return (
    <Dialog
      open
      onOpenChange={(e) => {
        if (!e && !isLogging) onClose();
      }}
    >
      <DialogContent className="max-w-xl! rounded-md">
        <DialogHeader>
          <DialogTitle className="lg:text-xl">
            Ghi nhận nỗ lực của bạn
          </DialogTitle>
          <DialogDescription>{habit.name}</DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="thought">
            <TextAnimate className="min-h-9" key={reflectionLabel}>
              {reflectionLabel}
            </TextAnimate>
          </FieldLabel>
          <Textarea
            value={thought}
            onChange={(e) => setThought(e.currentTarget.value)}
            placeholder="Kể cho mình nghe cảm giác của bạn lúc này nhé (Không bắt buộc)..."
            id="thought"
            className="resize-none"
          />
        </Field>
        <DialogFooter className="bg-white border-none">
          <Button
            disabled={isLogging}
            onClick={() => {
              if (!isLogging) onClose();
            }}
            className="self-start"
            variant="outline"
          >
            Để sau nè
          </Button>
          <Button onClick={() => onLog(habit.id, habit.time, thought)}>
            Lưu lại hành trình
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
