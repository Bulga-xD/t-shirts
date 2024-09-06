import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
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

const links = [
  {
    title: "Прглед",
    href: "/admin/overview",
  },
  {
    title: "Продукти",
    href: "/admin/products",
  },
  {
    title: "Поръчки",
    href: "/admin/orders",
  },
  {
    title: "Потребители",
    href: "/admin/users",
  },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col">
        <header className="w-full border-b sticky top-0 z-50 bg-white dark:bg-black">
          <div className="wrapper flex-between max-w-7xl m-auto p-5 md:px-10">
            <div className="flex-start gap-2">
              <div className="block sm:hidden">
                <Drawer direction="left">
                  <DrawerTrigger asChild>
                    <Button variant="outline">
                      <MenuIcon />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="h-full max-w-sm">
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
                              <Link href={`/search?category=${link.href}`}>
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
              <Link href="/" className="flex-start">
                <p className="font-another-danger">VANDALL</p>
              </Link>
            </div>
            <MainNav className="hidden sm:flex" />
            <div className="hidden md:block">
              <Search />
            </div>
            <Menu />
          </div>
          <div className="md:hidden block px-5 pb-2">
            <Search />
          </div>
        </header>
        <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
      </div>
    </>
  );
}
