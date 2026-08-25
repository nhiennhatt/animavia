"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";

import { AppSidebar } from "@/components/template/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const path = new URL(pathname, "http://0.0.0.0");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-white">
        <SidebarTrigger />
        <motion.div
          className="flex flex-col flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={path.pathname}
        >
          {children}
        </motion.div>
      </SidebarInset>
    </SidebarProvider>
  );
}
