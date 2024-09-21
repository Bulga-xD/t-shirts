import Link from "next/link";
import React from "react";
import MainNav from "./main-nav";
import Menu from "@/components/shared/header/menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import Search from "@/components/shared/header/search";
import { links } from "@/lib/constants";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full border-b sticky md:h-20 top-0 z-50 bg-white dark:bg-black">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="md:hidden">
                <Drawer direction="left">
                  <DrawerTrigger asChild>
                    <Button variant="outline">
                      <MenuIcon />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="h-full w-[250px]">
                    <DrawerHeader>
                      <DrawerTitle>Навигация</DrawerTitle>
                      <div className="space-y-1">
                        {links.map((link) => (
                          <Button
                            className="w-full justify-start"
                            variant="ghost"
                            key={link.href}
                            asChild
                          >
                            <DrawerClose asChild>
                              <Link
                                className="flex gap-1 justify-start items-center"
                                href={link.href}
                              >
                                <link.icon />
                                {link.title}
                              </Link>
                            </DrawerClose>
                          </Button>
                        ))}
                      </div>
                    </DrawerHeader>
                  </DrawerContent>
                </Drawer>
              </div>
              <Link href="/" className="flex items-center">
                <p className="font-another-danger">VANDALL</p>
              </Link>
            </div>
            <div className="hidden md:block flex-1 max-w-xl mx-4">
              <Search />
            </div>
            <Menu />
          </div>
          <div className="md:hidden py-2">
            <Search />
          </div>
        </div>
      </header>
      <div className="flex-grow flex flex-col md:flex-row">
        <MainNav className="hidden md:flex md:w-64 md:flex-shrink-0 md:pt-6" />
        <main className="flex-1 overflow-x-hidden">
          <div className="w-full mx-auto px-5 sm:px-6 lg:px-9 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
