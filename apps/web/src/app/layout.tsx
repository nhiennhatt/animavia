import type { Metadata } from "next";
import { Andada_Pro, Cascadia_Mono, Exo_2, Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./AppProvider";

const cascadiaMono = Cascadia_Mono({
  subsets: ["latin", "vietnamese"],
  variable: "--font-cascadia-Mono",
  weight: ["200", "300", "500"],
  adjustFontFallback: false,
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
      className={`${cascadiaMono.variable} ${andadaPro.variable} ${exo2.variable} ${exo2.className} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
