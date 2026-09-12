"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNav } from "@/components/layout/TopNav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopNav />
        <div className="flex-1 flex flex-col">
          <motion.div
            key={pathname}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>
          <div className="py-1">
            <p className="text-center text-xs text-neutral-600">
              &copy; 2026 Animavia Vietnam. All Rights Reserved.
            </p>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
