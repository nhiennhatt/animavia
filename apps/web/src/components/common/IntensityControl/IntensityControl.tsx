import { GeneralEmotion } from "@/types/emotion";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export function IntensityControl({
  emotion,
  intensity = null,
  onValueChange,
}: {
  emotion: GeneralEmotion | null;
  intensity?: GeneralEmotion | null;
  onValueChange?: (e: GeneralEmotion | null) => void;
}) {
  const [value, setValue] = useState<GeneralEmotion | null>(intensity);
  useEffect(() => setValue(null), [emotion]);
  useEffect(() => {
    if (onValueChange) onValueChange(value);
  }, [value]);

  return (
    <div className="w-full bg-white px-4 py-2 rounded-lg ring-3 ring-primary/10 h-full min-h-42 relative">
      <motion.div
        className="space-y-3"
        key={emotion?.code}
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        exit={{ transition: { duration: 0 } }}
      >
        {emotion && (
          <h2 className="text-center text-primary">
            {value ? value.name : emotion.name}
          </h2>
        )}
        {!emotion && <h2 className="text-center text-primary">Chọn cảm xúc</h2>}
        {emotion &&
          emotion.intensities &&
          emotion.intensities !== undefined && (
            <div className="space-y-1.5">
              <div className="flex">
                <label htmlFor="low" className="flex-1 text-start">
                  {emotion.intensities[0].name}
                </label>
                <label htmlFor="mid" className="flex-1 text-center">
                  {emotion.name}
                </label>
                <label htmlFor="high" className="flex-1 text-end">
                  {emotion.intensities[1].name}
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center z-0">
                  <div className="h-2.5 w-full bg-surface-container-low rounded-full"></div>
                </div>
                <div className="relative flex flex-row justify-between z-10">
                  <button
                    id="low"
                    data-active={value === emotion.intensities?.[0]}
                    className="size-6 ring-2 ring-neutral-300 rounded-full bg-white data-active:bg-primary"
                    onClick={() => setValue(emotion.intensities?.[0] || null)}
                  ></button>
                  <button
                    id="mid"
                    data-active={value === null}
                    className="size-6 ring-2 ring-neutral-300 rounded-full bg-white data-active:bg-primary"
                    onClick={() => setValue(null)}
                  ></button>
                  <button
                    id="high"
                    data-active={value === emotion.intensities?.[1]}
                    className="size-6 ring-2 ring-neutral-300 rounded-full bg-white data-active:bg-primary"
                    onClick={() => setValue(emotion.intensities?.[1] || null)}
                  ></button>
                </div>
              </div>
            </div>
          )}
      </motion.div>
    </div>
  );
}
