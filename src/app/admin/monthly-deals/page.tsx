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
import { deleteDeal, getAllDeals } from "@/lib/actions/monthly-deals.actions";
import { formatId } from "@/lib/utils";
import Link from "next/link";

const MonthlyDeal = async ({
  searchParams,
}: {
  searchParams: { page: string };
}) => {
  const page = Number(searchParams.page) || 1;
  const limit = 9;

  const { deals, totalPages } = await getAllDeals({ page, limit });
  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">ОФерти</h1>
        <Button asChild variant="default">
          <Link href="/admin/monthly-deals/create">Добави оферта</Link>
        </Button>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ИД</TableHead>
              <TableHead>Създадено на</TableHead>
              <TableHead className="w-[100px]">ДЕЙСТВИЯ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals?.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell>{formatId(deal.id)}</TableCell>
                <TableCell>{deal.createdAt.toDateString()}</TableCell>

                <TableCell className="flex gap-1">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/monthly-deals/${deal.id}`}>
                      Редактирай
                    </Link>
                  </Button>
                  <DeleteDialog id={deal.id} action={deleteDeal} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {totalPages! > 1 && <Pagination page={page} totalPages={totalPages!} />}
      </div>
    </div>
  );
};
export default MonthlyDeal;
