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
import {
  deleteReview,
  getAllUserReviews,
} from "@/lib/actions/user-reviews.actions";
import { APP_NAME } from "@/lib/constants";
import { formatDateTime, formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Admin Reviews - ${APP_NAME}`,
};

const UserReviewsAdminPage = async ({
  searchParams: { page = "1" },
}: {
  searchParams: { page: string };
}) => {
  const session = await auth();
  if (session?.user.role !== "admin")
    throw new Error("admin permission required");

  const { data: reviews, totalPages } = await getAllUserReviews({
    page: Number(page),
  });

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold uppercase">Ревюта</h1>
        <Button asChild variant="default">
          <Link href="/admin/user-reviews/create">Добави ревю</Link>
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ИД</TableHead>
              <TableHead>ИМЕ</TableHead>
              <TableHead>ГРАД</TableHead>
              <TableHead>РЕЙТИНГ</TableHead>
              <TableHead>ЗАГЛАВИЕ</TableHead>
              <TableHead>ОПИСАНИЕ</TableHead>
              <TableHead>ДЕЙСТВИЯ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{formatId(review.id)}</TableCell>
                <TableCell>
                  {review.fullName ? review.fullName : review.user?.name}
                </TableCell>

                <TableCell>{review.city}</TableCell>

                <TableCell>{review.rating}</TableCell>

                <TableCell>{review.title}</TableCell>
                <TableCell>
                  {formatDateTime(review.createdAt).dateTime}
                </TableCell>

                <TableCell className="flex gap-1">
                  <DeleteDialog id={review.id} action={deleteReview} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages!} />}
      </div>
    </div>
  );
};
export default UserReviewsAdminPage;
