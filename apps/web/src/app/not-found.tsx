"use client";

import { Button } from "@/components/ui/button";
import { useDynamicSegment } from "@/store/use-dynamic-segment";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function NotFound() {
  const setIsNotFound = useDynamicSegment((state) => state.setIsNotFound);

  useEffect(() => {
    setIsNotFound(true);

    return () => setIsNotFound(false);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-10 gap-x-3">
      <h1 className="text-base font-sans font-medium text-primary md:text-lg lg:text-2xl">
        Không tìm thấy
      </h1>
      <div className="flex-1 max-h-80">
        <DotLottieReact
          autoplay
          loop
          segment={[0, 293]}
          src="/lottie/Plant.lottie"
        />
      </div>
      <Button variant="link" asChild>
        <Link className="text-xl" href="/">
          <ArrowLeft /> Quay về trang chủ
        </Link>
      </Button>
    </div>
  );
}
