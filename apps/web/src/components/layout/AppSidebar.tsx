"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../ui/sidebar";
import Image from "next/image";
import { isPartOfPath } from "@/libs/utils/is-part-of-path";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { SIDEBAR_NAV_ITEMS } from "@/helpers/contants/navigation";
import { PanelLeftDashed } from "lucide-react";

export function AppSidebar() {
  const path = usePathname();
  const isMobile = useIsMobile();

  return (
    <Sidebar collapsible={isMobile ? "offcanvas" : "icon"}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/"
              className="flex items-center font-semibold text-primary text-4xl overflow-hidden"
            >
              <Image width="50" height="50" src="/images/LEAF.png" alt="" />
              Animavia
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {SIDEBAR_NAV_ITEMS.map((i) => (
              <SidebarMenuItem key={i.path}>
                <SidebarMenuButton
                  isActive={isPartOfPath(path, i.path)}
                  size="lg"
                  className="data-active:[&_svg]:stroke-3"
                  asChild
                >
                  <Link href={i.path}>
                    <i.Icon className="size-6!" />
                    <span>{i.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent> 
    </Sidebar>
  );
}
