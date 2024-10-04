import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderSummary } from "@/lib/actions/order.actions";
import { APP_NAME } from "@/lib/constants";
import { formatPrice, formatDateTime, formatNumber } from "@/lib/utils";
import { BadgeDollarSign, Barcode, CreditCard, Users } from "lucide-react";
import { Metadata } from "next";
import Charts from "./charts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Admin Dashboard - ${APP_NAME}`,
};

export default async function DashboardPage() {
  const session = await auth();
  if (!["admin", "superAdmin"].includes(session?.user.role!))
    throw new Error("admin permission required");

  const summary = await getOrderSummary();

  return (
    <div className="space-y-4">
      <h1 className="h2-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oбщи приходи</CardTitle>
            <BadgeDollarSign />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(Number(summary.ordersPrice._sum.totalPrice), {
                currency: "BGN",
                IntlFormat: "bg-BG",
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Продажби</CardTitle>
            <CreditCard />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.ordersCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Потребители</CardTitle>
            <Users />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.usersCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Продукти</CardTitle>
            <Barcode />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.productsCount}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Диаграма на продажбите</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Charts
              data={{
                salesData: summary.salesData,
              }}
            />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Последни продажби</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>КУПУВАЧ</TableHead>
                  <TableHead>ДАТА</TableHead>
                  <TableHead>ОБЩО</TableHead>
                  <TableHead>ДЕЙСТВИЯ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.latestOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {order.user?.name ? order.user.name : "Deleted user"}
                    </TableCell>

                    <TableCell>
                      {formatDateTime(order.createdAt).dateOnly}
                    </TableCell>
                    <TableCell>
                      {formatPrice(Number(order.totalPrice), {
                        currency: "BGN",
                        IntlFormat: "bg-BG",
                      })}
                    </TableCell>

                    <TableCell>
                      <Link href={`/order/${order.id}`}>
                        <span className="px-2">Детайли</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
