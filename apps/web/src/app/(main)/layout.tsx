"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";

import { AppSidebar } from "@/components/template/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { MobileNav } from "@/components/template/MobileNav";
import { AppBreadcrumb } from "@/components/template/AppBreadcrumb";

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-white">
        <MobileNav />
        <AppBreadcrumb />
        <motion.div
          className="flex flex-col flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={pathname}
        >
          {children}
        </motion.div>
      </SidebarInset>
    </SidebarProvider>
  );
}
