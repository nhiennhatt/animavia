"use client";

import { Button } from "@/components/ui/button";
import { useAuthenticated } from "@/hooks/use-authenticated";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function AuthLogin({ children }: { children: ReactNode }) {
  const router = useRouter();
  const authStatus = useAuthenticated();

  useEffect(() => {
    if (authStatus === "authenticated") {
      router.push("/");
    }
  }, [authStatus, router]);

  if (authStatus === "idle") {
    return "Loading...";
  }

  if (authStatus === "authenticated") return null;

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
        &copy; 2026 Animavia Vietnam. All rights reserved.
      </p>
    </div>
  );
}
