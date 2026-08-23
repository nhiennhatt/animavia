import confetti from "canvas-confetti";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fire(particleRatio: number, opts: object) {
  confetti({
    origin: { y: 0.7 },
    ...opts,
    particleCount: Math.floor(200 * particleRatio),
  });
}
