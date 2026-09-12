"use client";

import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser } from "@/hooks/use-user";
import { useIsMobile } from "@/hooks/use-mobile";
import { PanelLeft, SquareArrowRightEnter } from "lucide-react";
import { AppBreadcrumb } from "./AppBreadcrumb";
import { useSidebar } from "../ui/sidebar";
import { Button } from "../ui/button";
import { AccountDropDownMenu } from "./AccountDropDownMenu";

export function TopNav() {
  const user = useUser();
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();

  return (
    <div className="sticky top-0 left-0 right-0 bg-surface-cream shadow min-h-13 z-50">
      <div className="w-full h-full mx-auto px-3 md:px-5 py-1.5 flex justify-between items-center relative">
        <div className="flex gap-x-1 items-center">
          {!isMobile && (
            <button onClick={() => toggleSidebar()}>
              <PanelLeft className="size-5" />
            </button>
          )}
          {isMobile ? (
            <Link href="/">
              <div className="flex items-center">
                <Image
                  preload
                  src="/images/LEAF.png"
                  className="drop-shadow-accent drop-shadow self-baseline"
                  width={40}
                  height={40}
                  alt=""
                />
                <h1 className="text-2xl text-primary">Animavia</h1>
              </div>
            </Link>
          ) : (
            <AppBreadcrumb />
          )}
        </div>
        <div className="flex items-center">
          {user && !isMobile && (
            <AccountDropDownMenu>
              <Avatar className="size-8 md:size-10">
                <AvatarImage src="/images/avatar.png" />
                <AvatarFallback>{user.givenName?.[0] || ""}</AvatarFallback>
              </Avatar>
            </AccountDropDownMenu>
          )}
          {user === null && !isMobile && (
            <Button asChild className="rounded-sm">
              <Link href="/register">
                Đăng ký <SquareArrowRightEnter />
              </Link>
            </Button>
          )}
          {isMobile && (
            <button onClick={() => toggleSidebar()}>
              <PanelLeft className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
