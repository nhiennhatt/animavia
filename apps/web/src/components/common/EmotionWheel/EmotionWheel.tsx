"use client";
import { useEffect, useState } from "react";
import { GeneralEmotion } from "@/types/emotion";
import { checkIsSelected } from "@/helpers/emotion";
import { PrimaryEmotionPiece } from "./PrimaryEmotionPiece";
import { ComposedEmotionNode } from "./ComposedEmotionNode";
import { emotionWheel } from "@/config/emotion-wheel";
import { cn } from "@/lib/utils";
import { CircleLineHeart } from "@/components/icons";

export interface EmotionWheelProps {
  value?: GeneralEmotion | null;
  onChange?: (value: GeneralEmotion | null) => void;
}

export function EmotionWheel({ value = null, onChange }: EmotionWheelProps) {
  const pieceAngle = 360 / 8;
  const [currentEmotion, setCurrentEmotion] = useState<GeneralEmotion | null>(
    value,
  );

  useEffect(() => {
    onChange?.(currentEmotion);
  }, [currentEmotion, onChange]);

  return (
    <div className="w-full h-full overflow-hidden relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "w-full h-full aspect-square object-center object-contain select-none",
          "[&>g]:not-data-active:hover:brightness-90",
          "has-data-active:[&>g]:not-data-active:brightness-50",
          "has-data-active:[&>g]:not-data-active:grayscale-10",
          "has-data-active:[&>g]:not-data-active:hover:grayscale-0",
          "has-data-active:[&>g]:not-data-active:hover:brightness-65",
        )}
        style={{ rotate: `-${pieceAngle / 2}deg` }}
        viewBox="0 0 100 100"
      >
        {emotionWheel.primary.map((emotion, i) => {
          const isSelected = checkIsSelected(emotion, currentEmotion);
          return (
            <PrimaryEmotionPiece
              key={emotion.code}
              isSelected={isSelected}
              emotion={emotion}
              onClick={(e) => setCurrentEmotion(isSelected ? null : e)}
              pieceAngle={pieceAngle}
              wheelAmount={8}
            />
          );
        })}

        {emotionWheel.composed.map((emotion, i) => {
          const isSelected = checkIsSelected(emotion, currentEmotion);
          return (
            <ComposedEmotionNode
              key={emotion.code}
              emotion={emotion}
              isSelected={isSelected}
              onClick={(e) => setCurrentEmotion(isSelected ? null : e)}
              pieceAngle={pieceAngle}
            />
          );
        })}
        <circle r="10" fill="white" transform="translate(50, 50)" />
        <CircleLineHeart
          width="12"
          height="12"
          transform={`translate(44, 44) rotate(${pieceAngle / 2}, 6, 6)`}
        />
      </svg>
    </div>
  );
}
