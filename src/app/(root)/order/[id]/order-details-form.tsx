"use client";

import StripePayment from "./stripe-payment";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { formatPrice, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { ShippingAddress } from "@/types";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  deliverOrder,
  updateOrderToPaidByCOD,
} from "@/lib/actions/order.actions";

export default function OrderDetailsForm({
  order,
  paypalClientId,
  isAdmin,
  stripeClientSecret,
}: {
  order: Order;
  paypalClientId: string;
  isAdmin: boolean;
  stripeClientSecret: string | null;
}) {
  const {
    shippingAddress: shippingAddressRaw,
    orderItems,
    itemsPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  const { toast } = useToast();
  const shippingAddress = shippingAddressRaw as ShippingAddress;

  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await updateOrderToPaidByCOD(order.id);
            toast({
              variant: res.success ? "default" : "destructive",
              description: res.message,
            });
          })
        }
      >
        {isPending ? "Обработване..." : "Платено"}
      </Button>
    );
  };

  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await deliverOrder(order.id);
            toast({
              variant: res.success ? "default" : "destructive",
              description: res.message,
            });
          })
        }
      >
        {isPending ? "Обработване..." : "Доставено"}
      </Button>
    );
  };

  return (
    <section className="max-w-7xl m-auto p-5 md:px-10">
      <h1 className="py-4 text-2xl"> Поръчка {formatId(order.id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="overflow-x-auto md:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Начин на плащане</h2>
              <p>{paymentMethod}</p>
              {isPaid ? (
                <Badge variant="secondary">
                  Платено на {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Не е платено</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Адрес за доставка</h2>
              {shippingAddress ? (
                <>
                  <p>{shippingAddress.fullName}</p>
                  <p>
                    {shippingAddress.streetAddress}, {shippingAddress.city},{" "}
                    {shippingAddress.postalCode}, {shippingAddress.country}{" "}
                  </p>
                </>
              ) : (
                <p>Адресът за доставка не е наличен</p>
              )}

              {isDelivered ? (
                <Badge variant="secondary">
                  Доставено на {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Не е доставено</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Поръчани продукти</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Продукт</TableHead>
                    <TableHead>Количество</TableHead>
                    <TableHead>Размер</TableHead>
                    <TableHead>Цена</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
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
                      <TableCell>
                        <span className="px-2">{item.qty}</span>
                      </TableCell>
                      <TableCell>
                        <span className="px-2">{item.size}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(Number(item.price), {
                          currency: "BGN",
                          IntlFormat: "bg-BG",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-4 space-y-4 gap-4">
              <h2 className="text-xl pb-4">Детайли</h2>
              <div className="flex justify-between">
                <div>Продукти</div>
                <div>
                  {formatPrice(Number(itemsPrice), {
                    currency: "BGN",
                    IntlFormat: "bg-BG",
                  })}
                </div>
              </div>

              <div className="flex justify-between">
                <div>Доставка</div>
                <div>
                  {formatPrice(Number(shippingPrice), {
                    currency: "BGN",
                    IntlFormat: "bg-BG",
                  })}
                </div>
              </div>
              <div className="flex justify-between">
                <div>Общо</div>
                <div>
                  {formatPrice(Number(totalPrice), {
                    currency: "BGN",
                    IntlFormat: "bg-BG",
                  })}
                </div>
              </div>

              {!isPaid && paymentMethod === "Stripe" && stripeClientSecret && (
                <StripePayment
                  priceInCents={Number(order.totalPrice) * 100}
                  orderId={order.id}
                  clientSecret={stripeClientSecret}
                />
              )}

              {isAdmin && !isPaid && paymentMethod === "CashOnDelivery" && (
                <MarkAsPaidButton />
              )}
              {isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
