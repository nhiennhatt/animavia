import type { Metadata } from "next";
import { Andada_Pro, Exo_2, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./AppProvider";

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
      className={`${jetbrainsMono.variable} ${andadaPro.variable} ${exo2.variable} ${exo2.className} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
