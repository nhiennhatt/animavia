import { Metadata } from "next";
import { ReactNode } from "react";
import { LogModal } from "@/modules/habit/habit/LogModal";
import { ProtectedComponent } from "@/components/common/ProtectedComponent";

export const metadata: Metadata = {
  title: "Thói quen | Animavia",
};

export default function HabitLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedComponent>
      {children}
      <LogModal />
    </ProtectedComponent>
  );
}
