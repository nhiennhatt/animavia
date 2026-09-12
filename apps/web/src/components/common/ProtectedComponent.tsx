"use client";

import { useUser } from "@/hooks/use-user";
import { ReactNode, useEffect } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

export const ProtectedComponent = ({
  children,
  isLoadingOverlay = true,
  isSignInRedirect = false,
}: {
  children: ReactNode;
  isLoadingOverlay?: boolean;
  isSignInRedirect?: boolean;
}) => {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user === null && isSignInRedirect) router.push("/sign-in");
  }, [user, isSignInRedirect]);

  if (user === undefined) {
    if (isLoadingOverlay) {
      return (
        <Dialog open>
          <DialogContent className="bg-transparent ring-0 w-auto">
            <Spinner className="size-6" />
          </DialogContent>
        </Dialog>
      );
    }

    return <></>;
  }

  if (user === null) {
    return <p>Tính năng yêu cầu đăng nhập</p>;
  }

  return <>{children}</>;
};
