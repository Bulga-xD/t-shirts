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
import {
  deleteHeroData,
  getHeroData,
} from "@/lib/actions/hero-section.actions";
import { formatId } from "@/lib/utils";
import Link from "next/link";

const HeroSectionAdminPage = async ({
  searchParams,
}: {
  searchParams: { page: string };
}) => {
  const page = Number(searchParams.page) || 1;
  const { data, totalPages } = await getHeroData();

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Снимки на началната страница</h1>
        <div className="space-x-4">
          <Button asChild variant="default">
            <Link href="/admin/hero-section/create">Добави</Link>
          </Button>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ИД</TableHead>
              <TableHead>Текст</TableHead>
              <TableHead className="w-[100px]">ДЕЙСТВИЯ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{formatId(item.id)}</TableCell>

                <TableCell>{item.text}</TableCell>

                <TableCell className="flex gap-1">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/hero-section/${item.id}`}>
                      Редактирай
                    </Link>
                  </Button>
                  <DeleteDialog id={item.id} action={deleteHeroData} />
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
export default HeroSectionAdminPage;
