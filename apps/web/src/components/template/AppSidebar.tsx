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
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SquareArrowRightExit } from "lucide-react";

export function AppSidebar() {
  return (
    <Sidebar className="border-none">
      <SidebarHeader>
        <Link
          href="/"
          className="text-4xl font-bold mx-2 px-3.5 py-2 md:py-4 font-heading text-primary transition-[text-shadow] text-shadow-xs hover:text-shadow-secondary"
        >
          PNEUMA
        </Link>
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
          <SidebarMenuItem>
            <SidebarMenuButton className="flex justify-between text-orange-800">
              Đăng xuất
              <SquareArrowRightExit />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
