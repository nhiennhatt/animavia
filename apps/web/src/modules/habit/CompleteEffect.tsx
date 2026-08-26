import { Fragment, useEffect, useState } from "react";
import { motion } from "motion/react";
import { useSound } from "use-sound";

import { fire } from "@/lib/utils";
import { successLogHabitQuotes } from "@/config/success-log-habit-quotes";
import { successLogHabitSound } from "@/config/success-log-habit-sound";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Dialog as PrimitiveDialog } from "radix-ui";

export function CompleteEffect({
  onClick,
  isOpen,
}: {
  onClick: () => void;
  isOpen: boolean;
}) {
  const [isComplete, setIsComplete] = useState(false);
  const [sound, setSound] = useState(
    successLogHabitSound[
      Math.trunc(Math.random() * successLogHabitSound.length)
    ],
  );
  const [statement, setStatement] = useState(
    successLogHabitQuotes[
      Math.trunc(Math.random() * successLogHabitQuotes.length)
    ],
  );
  const [playSuccess] = useSound(
    [`/audio/${sound}.webm`, `/audio/${sound}.mp3`],
    { volume: 0.5 },
  );
  useEffect(() => {
    if (isOpen) {
      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });

      playSuccess();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setStatement(
        successLogHabitQuotes[
          Math.trunc(Math.random() * successLogHabitQuotes.length)
        ],
      );

      setSound(
        successLogHabitSound[
          Math.trunc(Math.random() * successLogHabitSound.length)
        ],
      );
    }
  }, [isOpen]);

  const handleClick = () => {
    if (isComplete) {
      onClick();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) handleClick();
      }}
    >
      <DialogPortal>
        <DialogOverlay className="bg-[radial-gradient(ellipse,white,transparent)]" />
        <PrimitiveDialog.Content
          className="bg-[radial-gradient(ellipse,white,transparent)] rounded-lg fixed top-1/2 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-transparent p-5 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          data-slot="dialog-content"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: ["easeInOut"], delay: 0.3, duration: 2 }}
            onAnimationComplete={() => setIsComplete(true)}
            onClick={(e) => e.stopPropagation()}
            className="p-5 text-center"
          >
            <p className="text-primary font-heading text-center text-lg md:text-xl xl:text-2xl pointer-events-none">
              &ldquo;{statement.statement}&rdquo;
            </p>
          </motion.div>
        </PrimitiveDialog.Content>
        <PrimitiveDialog.Content
          data-slot="dialog-content"
          className="fixed bottom-0 mb-10 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="text-center"
          >
            <p className="text-neutral-500 pointer-events-none inline-block">
              Nhấn để tiếp tục
            </p>
          </motion.div>
        </PrimitiveDialog.Content>
      </DialogPortal>
    </Dialog>
  );
}
