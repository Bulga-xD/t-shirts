import { auth } from "@/auth";
import CreateReviewForm from "@/components/shared/admin/review-form";

const CreateUserReview = async () => {
  const session = await auth();
  let userId = null;
  if (session) {
    userId = session.user.id;
  }

  return (
    <>
      <h1 className="h2-bold">Създай ревю</h1>

      <div className="my-8">
        <CreateReviewForm userId={userId} />
      </div>
    </>
  );
};
export default CreateUserReview;
