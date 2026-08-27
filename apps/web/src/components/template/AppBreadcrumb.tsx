"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { useDynamicRoute } from "@/stores/dynamic-route.store";
import { STATIC_ROUTES } from "@/config/static-routes";
import { Fragment } from "react/jsx-runtime";
import Link from "next/link";

function AppBreadcrumbItem({
  label,
  href,
  isLast,
}: {
  label: string;
  href: string;
  isLast: boolean;
}) {
  if (!isLast) {
    return (
      <BreadcrumbLink
        className="max-w-[18ch] md:max-w-[25ch] text-ellipsis text-nowrap overflow-hidden"
        asChild
      >
        <Link href={href}>{label}</Link>
      </BreadcrumbLink>
    );
  }

  return (
    <BreadcrumbPage className="max-w-[18ch] md:max-w-[25ch] text-ellipsis text-nowrap overflow-hidden">
      {label}
    </BreadcrumbPage>
  );
}

export function AppBreadcrumb() {
  const pathname = usePathname();
  const dynamicRoute = useDynamicRoute((s) => s.dynamicRoute);
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  return (
    <Breadcrumb className="px-1 md:px-4 py-5">
      <BreadcrumbList className="text-xs md:text-base max-md:gap-x-0.5">
        {segments.map((s, i) => {
          const href = `/${segments.slice(0, i + 1).join("/")}`;

          return (
            <Fragment key={s}>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <AppBreadcrumbItem
                  label={
                    STATIC_ROUTES[href] ||
                    dynamicRoute[s] ||
                    s.replace(/-/g, " ")
                  }
                  href={href}
                  isLast={i === segments.length - 1}
                />
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
