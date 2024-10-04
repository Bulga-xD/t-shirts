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
import { deleteSize, getAllSizes } from "@/lib/actions/size.actions";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Admin Colors - ${APP_NAME}`,
};

export default async function Sizes({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const session = await auth();
  if (!["admin", "superAdmin"].includes(session?.user.role!))
    throw new Error("admin permission required");

  const page = Number(searchParams.page) || 1;
  const { sizes, totalPages } = await getAllSizes({
    page,
    limit: 9,
  });
  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Размери за тениски</h1>
        <Button asChild variant="default">
          <Link href="/admin/sizes/create">Добави размер</Link>
        </Button>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Размер</TableHead>
              <TableHead>ДЕЙСТВИЯ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sizes.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.id}</TableCell>
                <TableCell>{s.label}</TableCell>

                <TableCell className="flex gap-1">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/sizes/${s.id}`}>Редактирай</Link>
                  </Button>
                  <DeleteDialog id={s.id} action={deleteSize} />
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
