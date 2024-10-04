import { auth } from "@/auth";
import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteColor, getAllColors } from "@/lib/actions/color.actions";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Admin Colors - ${APP_NAME}`,
};

export default async function Colors({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const session = await auth();
  if (!["admin", "superAdmin"].includes(session?.user.role!))
    throw new Error("admin permission required");

  const page = Number(searchParams.page) || 1;
  const { colors, totalPages } = await getAllColors({
    page,
    limit: 9,
  });
  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Цветове за тениски</h1>
        <Button asChild variant="default">
          <Link href="/admin/colors/create">Добави цвят</Link>
        </Button>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Цвят</TableHead>
              <TableHead>ДЕЙСТВИЯ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {colors.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell>{c.label}</TableCell>

                <TableCell className="flex gap-1">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/colors/${c.id}`}>Редактирай</Link>
                  </Button>
                  <DeleteDialog id={c.id} action={deleteColor} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {totalPages! > 1 && <Pagination page={page} totalPages={totalPages!} />}
      </div>
    </div>
  );
}
