"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { NAV_SEGMENT_NAMES } from "@/helpers/contants/navigation";
import { match } from "path-to-regexp";
import { useMemo } from "react";
import { useDynamicSegment } from "@/store/use-dynamic-segment";

function AppBreadcrumbItem({
  label,
  href,
  isLast,
}: {
  label: string;
  href: string;
  isLast: boolean;
}) {
  return (
    <>
      <BreadcrumbSeparator>/</BreadcrumbSeparator>
      <BreadcrumbItem>
        {isLast ? (
          <BreadcrumbPage>{label}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink asChild>
            <Link href={href}>{label}</Link>
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
    </>
  );
}

export function AppBreadcrumb() {
  const path = usePathname();
  const dynamicSegment = useDynamicSegment((state) => state.dynamicSegment);

  const breadcrumbs = useMemo(() => {
    const segments = path.split("/").filter(Boolean);
    return segments.map((s, i) => {
      const href = `/${segments.slice(0, i + 1).join("/")}`;
      const matched = Object.entries(NAV_SEGMENT_NAMES).find(([pattern]) => {
        const matchFn = match(pattern, { decode: decodeURIComponent });
        return matchFn(href);
      });

      if (!matched) return { href, label: "Không tìm thấy" };

      if (matched[1].startsWith(":")) {
        return {
          href,
          label: dynamicSegment[matched[1]] || "Không tìm thấy",
        };
      }

      return { href, label: matched[1] };
    });
  }, [path, dynamicSegment]);

  return (
    <Breadcrumb>
      <BreadcrumbList className="gap-x-0.5">
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          {breadcrumbs.length !== 0 ? (
            <BreadcrumbLink asChild>
              <Link href="/">Trang chủ</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Trang chủ</BreadcrumbPage>
          )}
        </BreadcrumbItem>

        {breadcrumbs.map(({ href, label }, i) => (
          <AppBreadcrumbItem
            key={href}
            label={label}
            href={href}
            isLast={i === breadcrumbs.length - 1}
          />
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
