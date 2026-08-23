"use client";

import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/hooks/use-user";
import { exchangeGoogleToken } from "@/services/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function OAuthCallback({ code }: { code: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, loading } = useUser();
  const { mutate: handleExchangeCode } = useMutation({
    mutationFn: async (code: string) => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      await exchangeGoogleToken(code, timezone);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["authenticatedUser"],
      });
      router.push("/");
    },
  });

  const executed = useRef(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [loading, user]);

  useEffect(() => {
    if (!executed.current && !loading && !user) {
      executed.current = true;
      handleExchangeCode(code);
    }
  }, [executed, loading, user]);

  return (
    <div className="text-center p-3 flex flex-col items-center justify-center">
      <Spinner className="size-8" />
      <p className="text-3xl">
        Đừng vội rời đi. Hệ thống đang xử lý yêu cầu...
      </p>
    </div>
  );
}
