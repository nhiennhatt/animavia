import { Fragment, useEffect, useState } from "react";
import { motion } from "motion/react";
import { useSound } from "use-sound";

import { fire } from "@/lib/utils";

export function CompleteEffect({
  onClick,
  isOpen,
}: {
  onClick: () => void;
  isOpen: boolean;
}) {
  const [isComplete, setIsComplete] = useState(false);
  const [playSuccess] = useSound([`audio/success.webm`, `/audio/success.mp3`]);
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

  const handleClick = () => {
    if (isComplete) {
      onClick();
    }
  };

  if (!isOpen) return <Fragment></Fragment>;

  return (
    <motion.div
      onClick={handleClick}
      initial={{ backdropFilter: "blur(0rem)", opacity: 0 }}
      animate={{ backdropFilter: "blur(1rem)", opacity: 1 }}
      transition={{ delay: 0.5, ease: ["easeInOut"], duration: 2.5 }}
      onAnimationComplete={() => {
        setIsComplete(true);
      }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-neutral-300/5"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="z-50 p-5 w-full max-w-2xl bg-[radial-gradient(ellipse,white,transparent)] text-center space-y-3"
      >
        <p className="text-primary font-heading text-center text-lg md:text-xl xl:text-2xl pointer-events-none">
          &ldquo;Hãy trò chuyện với bản thân y hệt như cách bạn đang nói với một
          người mà bạn vô cùng yêu thương.&rdquo;
        </p>
        <span className="italic max-md:text-sm">Brené Brown</span>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4 }}
        className="absolute bottom-0 mb-10"
      >
        <p className="text-neutral-500 pointer-events-none">Nhấn để tiếp tục</p>
      </motion.div>
    </motion.div>
  );
}
