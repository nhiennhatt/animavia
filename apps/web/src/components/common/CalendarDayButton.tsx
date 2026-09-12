import { cn } from "@/libs/utils/tailwindcss";
import { DayButtonProps } from "@daypicker/react";
import { Check } from "lucide-react";

export function CalendarDayButton({
  children,
  modifiers,
  onClick,
  ...props
}: DayButtonProps) {
  return (
    <button
      onClick={onClick}
      data-invalid={modifiers.isDisabled && !modifiers.logged}
      disabled={!modifiers.today || modifiers.logged}
      className={cn(
        "bg-neutral-100 rounded-sm w-full flex flex-col justify-center p-1 md:p-2.5 gap-y-1",
        "data-[invalid=true]:bg-transparent",
        "not-disabled:cursor-pointer",
        modifiers.today ? "text-foreground bg-primary-fixed/30!" : "",
        modifiers.today || modifiers.logged ? "ring ring-primary/30" : "",
      )}
    >
      {children}
      <div
        className={cn(
          "aspect-square w-full bg-neutral-200/75 rounded-full flex items-center justify-center",
          modifiers.logged ? "bg-primary text-surface-cream" : "",
          modifiers.today && !modifiers.logged ? "bg-surface-cream" : "",
        )}
      >
        {modifiers.logged && <Check className="size-4" />}
      </div>
    </button>
  );
}
