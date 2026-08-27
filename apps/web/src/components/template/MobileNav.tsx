"use client";

import Link from "next/link";
import Image from "next/image";
import { PanelLeftOpen } from "lucide-react";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

export function MobileNav() {
  const { toggleSidebar } = useSidebar();

  return (
    <nav className="hidden max-md:block max-md:sticky py-2 w-full top-0 z-50 bg-surface shadow">
      <div className="flex gap-x-1">
        <Button className="text-primary" onClick={toggleSidebar} variant="ghost" size="icon-lg">
          <PanelLeftOpen />
        </Button>
        <Link
          href="/"
          className="absolute flex gap-x-1 items-center left-1/2 translate-x-[calc(-0.5*100%-var(--spacing)*4)]"
        >
          <div>
            <Image
              preload
              src="/images/LEAF.png"
              alt="leaf-symbol"
              width={40}
              height={40}
              className="size-9"
            />
          </div>
          <div>
            <span className="leading-0 text-2xl font-bold font-heading text-primary transition-[text-shadow] text-shadow-xs hover:text-shadow-secondary">
              Animavia
            </span>
            <p className="mx-0.5 font-sans text-xs font-normal leading-1.5 text-center">
              Dẫn lối tâm hồn
            </p>
          </div>
        </Link>
      </div>
    </nav>
  );
}
