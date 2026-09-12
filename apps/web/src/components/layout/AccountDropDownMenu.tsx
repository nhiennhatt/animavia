"use client";

import { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SquareArrowRightExit } from "lucide-react";
import { logout } from "@/services/auth-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function AccountDropDownMenu({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { mutate: handleLogout } = useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userInform"] });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => handleLogout()}
            variant="destructive"
          >
            <SquareArrowRightExit /> Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
