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
import { User } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import PlaceOrderForm from "./place-order-form";
import { ColorType, SizeType } from "@/types";

type Address = {
  fullName: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
};

export const OrderCart = ({
  user,
  colors,
  sizes,
}: {
  user: User;
  colors: ColorType[];
  sizes: SizeType[];
}) => {
  const { items } = useCart();

  const address = user.address as Address;
  const itemsPrice = items.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalPrice = itemsPrice + shippingPrice;

  return (
    <div className="grid md:grid-cols-3 md:gap-5">
      <div className="overflow-x-auto md:col-span-2 space-y-4">
        <Card>
          <CardContent className="p-4 flex flex-col gap-2">
            <h2 className="text-xl pb-4">Адрес за доставка</h2>
            <p>{address?.fullName}</p>
            <p>
              {address?.streetAddress}, {address?.city}, {address?.postalCode},{" "}
              {address?.country}{" "}
            </p>
            <p>Телефон за връзка: {address.phoneNumber}</p>
            <div>
              <Link href="/shipping-address">
                <Button variant="outline">Промени</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 gap-4">
            <h2 className="text-xl pb-4">Начин на плащане</h2>
            <p>Наложен платеж</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 gap-4">
            <h2 className="text-xl pb-4">Продукти</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Продукт</TableHead>
                  <TableHead>Количество</TableHead>
                  <TableHead>Размер</TableHead>
                  <TableHead>Цвят</TableHead>
                  <TableHead>Цена</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, idx) => {
                  const variant = item.variants[0];

                  return (
                    <TableRow key={idx}>
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
                      <TableCell>
                        <span className="px-2">{item.qty}</span>
                      </TableCell>
                      <TableCell>
                        <span className="px-2">
                          {sizes.find((s) => s.id === variant.sizeId)?.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="px-2">
                          {colors.find((c) => c.id === variant.colorId)?.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        {formatPrice(item.price, {
                          currency: "BGN",
                          IntlFormat: "bg-BG",
                        })}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <Link href="/cart">
              <Button variant="outline">Промени</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardContent className="p-4 gap-4 space-y-4">
            <div className="flex justify-between">
              <div>Продукти</div>
              <div>
                {formatPrice(itemsPrice, {
                  currency: "BGN",
                  IntlFormat: "bg-BG",
                })}
              </div>
            </div>
            <div className="flex justify-between">
              <div>Доставка</div>
              <div>
                {formatPrice(shippingPrice, {
                  currency: "BGN",
                  IntlFormat: "bg-BG",
                })}
              </div>
            </div>
            <div className="flex justify-between">
              <div>Общо</div>
              <div>
                {formatPrice(totalPrice, {
                  currency: "BGN",
                  IntlFormat: "bg-BG",
                })}
              </div>
            </div>
            <PlaceOrderForm
              items={items}
              itemsPrice={itemsPrice}
              shippingPrice={shippingPrice}
              totalPrice={totalPrice}
              phoneNumber={address.phoneNumber}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
