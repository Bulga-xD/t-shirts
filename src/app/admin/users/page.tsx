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
import { deleteUser, getAllUsers } from "@/lib/actions/user.actions";
import { APP_NAME } from "@/lib/constants";
import { formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Admin Users - ${APP_NAME}`,
};

export default async function AdminUser({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const session = await auth();
  if (!["admin", "superAdmin"].includes(session?.user.role!))
    throw new Error("admin permission required");

  const page = Number(searchParams.page) || 1;
  const users = await getAllUsers({
    page,
    limit: 9,
  });

  const isCurrentUserSuperAdmin = session?.user.role === "superAdmin";

  return (
    <div className="space-y-2">
      <h1 className="h2-bold">Потребители</h1>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>ИМЕ</TableHead>
              <TableHead>ИМЕЙЛ</TableHead>
              <TableHead>РОЛЯ</TableHead>
              <TableHead>ДЕЙСТВИЯ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="flex gap-1">
                  {(isCurrentUserSuperAdmin || user.role !== "superAdmin") && (
                    <>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/users/${user.id}`}>Редактирай</Link>
                      </Button>
                      <DeleteDialog id={user.id} action={deleteUser} />
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users?.totalPages! > 1 && (
          <Pagination page={page} totalPages={users?.totalPages!} />
        )}
      </div>
    </div>
  );
}
