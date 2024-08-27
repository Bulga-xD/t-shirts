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
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Drawer direction="left">
            <DrawerTrigger asChild>
              <Button variant="outline">
                <MenuIcon />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Select a category</DrawerTitle>
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
          <Link href="/" className="flex-start">
            <Image
              src="/assets/icons/logo.svg"
              width={48}
              height={48}
              alt={`${APP_NAME} logo`}
            />
            {APP_NAME}
          </Link>
        </div>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
