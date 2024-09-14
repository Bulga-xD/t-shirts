import { getSingleReview } from "@/lib/actions/user-reviews.actions";

const UserReviewAdminDetails = async ({
  params: { id },
}: {
  params: {
    id: string;
  };
}) => {
  const review = await getSingleReview(id);

  return (
    <>
      <h1 className="text-3xl font-bold text-center">Ревю</h1>
      <section className="border p-4 rounded-md shadow-md max-w-6xl m-auto">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <p>ИД на ревюто - {review?.id}</p>
            <p>от {review?.createdAt.toLocaleDateString("bg-BG")}</p>
          </div>
          <hr />
          <p>Име на потребителя - {review?.fullName || review?.user.name}</p>
          <hr />
          <p>Град - {review?.city}</p>
          <hr />
          <p>Заглавие на ревюто - {review?.title}</p>
          <hr />
          <div>
            <p>Описание на ревюто:</p>
            <p className="pl-1">{review?.text}</p>
          </div>
          <hr />
          <p>{review?.createdAt.toLocaleDateString()}</p>
          <hr />
          <div className="flex flex-col gap-2">
            <h2>Потребител - {review?.userId}</h2>
            <hr />
            <p>{review?.user.name}</p>
            <hr />
            <p>{review?.user.email}</p>
            <hr />
          </div>
        </div>
      </section>
    </>
  );
};
export default UserReviewAdminDetails;
