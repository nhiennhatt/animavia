import { Circle } from "lucide-react";
import { Button } from "../ui/button";

export function LogHabitButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      onClick={() => onClick()}
      className="bg-accent hover:bg-accent/50 border border-neutral-300 px-3 font-normal font-mono w-full max-md:justify-start"
    >
      <Circle className="size-3" />
      Ghi nhận
    </Button>
  );
}
