"use client";

import { EmotionWheel } from "@/components/common/EmotionWheel";
import { IntensityControl } from "@/components/common/IntensityControl";
import { GeneralEmotion } from "@/types/emotion";
import { useEffect, useState } from "react";

export function Emotion() {
  const [emotion, setEmotion] = useState<GeneralEmotion | null>(null);
  const [intensity, setIntensity] = useState<GeneralEmotion | null>(null);

  useEffect(() => {
    setIntensity(null);
  }, [emotion]);

  const options: GeneralEmotion[] | null = emotion?.intensities
    ? [emotion.intensities[0], emotion, emotion.intensities[1]]
    : null;

  return (
    <div className="mx-auto max-w-4xl w-full">
      <div className="flex justify-center items-center flex-col">
        <div className="max-w-lg w-full flex flex-col gap-y-5">
          <div>
            <EmotionWheel value={emotion} onChange={setEmotion} />
          </div>
          <IntensityControl
            emotion={emotion}
            intensity={intensity}
            onValueChange={(e) => setIntensity(e)}
          />
        </div>
      </div>
    </div>
  );
}
