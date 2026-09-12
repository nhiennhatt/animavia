import { BadgeCheck } from "lucide-react";
import { Button } from "../ui/button";

export function CompleteHabitButton() {
  return (
    <Button
      variant="outline"
      className="text-primary! bg-background hover:bg-primary/5 border border-primary px-3 font-normal font-mono w-full max-md:justify-start"
    >
      <BadgeCheck className="size-5" />
      Đã hoàn thành
    </Button>
  );
}
