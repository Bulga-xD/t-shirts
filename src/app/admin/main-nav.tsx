"use client";

import { links } from "@/lib/constants";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  return (
    <nav
      className={cn(
        "sticky top-[80px] flex flex-col items-start gap-4 min-h-[calc(100vh-80px)] overflow-y-auto bg-slate-100 p-8",
        className
      )}
      {...props}
    >
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-xl flex gap-1 items-center font-medium transition-colors hover:text-primary",
            pathname.includes(item.href) ? "" : "text-muted-foreground"
          )}
        >
          <item.icon />
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
