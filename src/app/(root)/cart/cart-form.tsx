"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCart } from "@/hooks/use-cart";
import { getColorById } from "@/lib/actions/color.actions";
import { formatPrice } from "@/lib/utils";
import { ColorType } from "@/types";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function CartForm({ colors }: { colors: ColorType[] }) {
  const router = useRouter();
  const { items, addItem, decreaseItem } = useCart();

  const [isPending, startTransition] = useTransition();

  const cartTotal = items.reduce(
    (total, product) => total + product.price! * product.qty,
    0
  );

  return (
    <section className="max-w-7xl m-auto p-5 md:px-10">
      <h1 className="py-4 h2-bold">Продукти</h1>

      {items.length === 0 ? (
        <div>
          Количката е празна.{" "}
          <Link
            className="font-bold hover:underline hover:underline-offset-2"
            href="/"
          >
            Отиди да я напълниш!
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Продукт</TableHead>
                  <TableHead className="text-center">Количество</TableHead>
                  <TableHead className="text-center">Размер</TableHead>
                  <TableHead className="text-center">Цвят</TableHead>
                  <TableHead className="text-center">Цена</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        ></Image>
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2">
                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() => decreaseItem(item.productId, item.size)}
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4  animate-spin" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                      </Button>
                      <span>{item.qty}</span>
                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() => addItem(item)}
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4  animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">{item.size}</TableCell>
                    <TableCell className="text-center">
                      {colors.find((c) => c.id === item.color)?.label}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(item.price, {
                        currency: "BGN",
                        IntlFormat: "bg-BG",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <Card>
              <CardContent className="p-4 gap-4">
                <div className="pb-3 text-xl">
                  Общо ({items.reduce((a, c) => a + c.qty, 0)}):{" "}
                  {formatPrice(cartTotal, {
                    currency: "BGN",
                    IntlFormat: "bg-BG",
                  })}
                </div>
                <Button
                  onClick={() =>
                    startTransition(() => router.push("/shipping-address"))
                  }
                  className="w-full"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader className="animate-spin w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  Адрес за доставка
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </section>
  );
}
