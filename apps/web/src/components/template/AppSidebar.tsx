"use client";

import Link from "next/link";
import { SquareArrowRightEnter, SquareArrowRightExit } from "lucide-react";

import { sidebarMenu } from "@/config/sidebar-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useUser } from "@/hooks/use-user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/services/user.service";

export function AppSidebar() {
  const { user, loading } = useUser();
  const queryClient = useQueryClient();
  const { mutate: handleLogout } = useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["authenticatedUser"],
      });
    },
  });

  return (
    <Sidebar className="border-none">
      <SidebarHeader className="py-5 space-y-3">
        <div className="mx-3">
          <Link
            href="/"
            className="text-4xl font-bold font-heading text-primary transition-[text-shadow] text-shadow-xs hover:text-shadow-secondary"
          >
            Animavia
          </Link>
          <p className="mx-0.5 font-sans font-normal">Dẫn lối tâm hồn</p>
        </div>
        <SidebarMenu>
          <SidebarMenuItem className="px-2">
            {!loading &&
              (!user ? (
                <Button
                  asChild
                  className="w-full text-lg h-auto! py-2 rounded-xl"
                >
                  <Link href="/login">
                    Đăng nhập
                    <SquareArrowRightEnter />
                  </Link>
                </Button>
              ) : (
                <Button className="w-full text-lg h-auto! py-2 rounded-xl">
                  Hồi tâm hằng ngày
                </Button>
              ))}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu
              className={cn(
                "gap-y-1 md:gap-y-2",
                "md:**:data-[sidebar=menu-button]:py-5 md:**:data-[sidebar=menu-button]:px-3.5 md:**:data-[sidebar=menu-button]:text-lg",
                "**:data-[sidebar=menu-button]:data-active:font-bold",
                "**:data-[sidebar=menu-button]:py-3 **:data-[sidebar=menu-button]:px-1.5 **:data-[sidebar=menu-button]:text-base",
              )}
            >
              {Object.entries(sidebarMenu).map(([key, i]) => (
                <SidebarMenuItem key={key}>
                  <SidebarMenuButton asChild>
                    <Link href={i.href}>
                      <i.icon
                        className="size-3.5! md:size-4!"
                        width={16}
                        height={16}
                      />
                      {i.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {user && (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => handleLogout()}
                className="flex justify-between text-orange-800"
              >
                Đăng xuất
                <SquareArrowRightExit />
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
