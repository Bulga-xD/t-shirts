import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";
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
import { getAllCategories } from "@/lib/actions/product.actions";
import Link from "next/link";
import Image from "next/image";
import Search from "./search";

interface Category {
  category: string;
}

const Header = async () => {
  let categories: Category[] = [];

  try {
    categories = await getAllCategories();
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  return (
    <header className="w-full border-b sticky top-0 z-50 bg-white dark:bg-black">
      <div className="wrapper flex-between max-w-7xl m-auto p-5 md:px-10">
        <div className="flex-start gap-2">
          <div className="hidden sm:block">
            <Drawer direction="left">
              <DrawerTrigger asChild>
                <Button variant="outline">
                  <MenuIcon />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Изберете категория</DrawerTitle>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <Button
                        className="w-full justify-start"
                        variant="ghost"
                        key={category.category}
                        asChild
                      >
                        <DrawerClose asChild>
                          <Link href={`/search?category=${category.category}`}>
                            {category.category}
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
        <div className="hidden md:block">
          <Search />
        </div>
        <Menu />
      </div>
      <div className="md:hidden block px-5 pb-2">
        <Search />
      </div>
    </header>
  );
};

export default Header;
