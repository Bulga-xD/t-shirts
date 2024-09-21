"use client";

import { links } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const [showNav, setShowNav] = useState(true);

  return (
    <>
      <AnimatePresence>
        {showNav && (
          <motion.nav
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              `fixed top-[80px] left-0 flex-col items-start gap-4 h-[calc(100vh-80px)] w-64 overflow-y-auto bg-slate-100 p-8 dark:bg-slate-800 dark:text-white shadow-lg z-50`,
              className
            )}
            {...props}
          >
            <ChevronLeft
              className="self-end cursor-pointer"
              onClick={() => setShowNav(false)}
            />
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
          </motion.nav>
        )}
      </AnimatePresence>

      <button
        onClick={() => setShowNav(true)}
        className={`fixed top-[80px] left-0 lg:p-1 xl:p-2 bg-slate-100 dark:bg-slate-800 dark:text-white z-50 ${
          showNav ? "hidden" : "block"
        }`}
      >
        <ChevronRight />
      </button>
    </>
  );
}
