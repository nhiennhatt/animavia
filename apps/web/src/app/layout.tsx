import type { Metadata } from "next";
import { Andada_Pro, Exo_2, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { TopNav } from "@/components/layout/TopNav";
import { AppProvider } from "./AppProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  variable: "--font-jetbrains-mono",
});

const andadaPro = Andada_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-andada-pro",
});

const exo2 = Exo_2({
  subsets: ["latin", "vietnamese"],
  variable: "--font-exo-2",
});

export const metadata: Metadata = {
  title: "Animavia",
  description: "Animavia - Dẫn lối tâm hồn.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${andadaPro.variable} ${exo2.variable} ${andadaPro.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface">
        <AppProvider>
          <div className="flex-1 flex bg-surface">{children}</div>
        </AppProvider>
      </body>
    </html>
  );
}
