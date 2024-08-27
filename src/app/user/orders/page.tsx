import Pagination from "@/components/shared/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMyOrders } from "@/lib/actions/order.actions";
import { APP_NAME } from "@/lib/constants";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `My orders - ${APP_NAME}`,
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const page = Number(searchParams.page) || 1;
  const orders = await getMyOrders({
    page,
    limit: 6,
  });

  return (
    <div className="space-y-2">
      <h2 className="h2-bold">Orders</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>ДАТА</TableHead>
              <TableHead>ОБЩО</TableHead>
              <TableHead>ПЛАТЕНА</TableHead>
              <TableHead>ДОСТАВНА</TableHead>
              <TableHead>ДЕЙСТВИЯ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id.substring(20, 24)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                <TableCell>
                  {formatPrice(order.totalPrice.toNumber(), {
                    currency: "BGN",
                    IntlFormat: "bg-BG",
                  })}
                </TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : "not paid"}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : "not delivered"}
                </TableCell>
                <TableCell>
                  <Link href={`/order/${order.id}`}>Details</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination page={page} totalPages={orders?.totalPages!} />
        )}
      </div>
    </div>
  );
}
