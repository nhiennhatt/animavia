import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLogin({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface flex-1 flex items-center relative">
      <div className="absolute left-0 top-0 m-10">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft /> Quay về trang chủ
          </Link>
        </Button>
      </div>
      {children}
      <p className="absolute bottom-0 left-0 right-0 text-center text-sm text-primary/70 mb-2">
        &copy; 2026 Pneuma Vietnam. All rights reserved.
      </p>
    </div>
  );
}
