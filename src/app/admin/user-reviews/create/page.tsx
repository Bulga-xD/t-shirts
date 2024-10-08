import { auth } from "@/auth";
import CreateReviewForm from "@/components/shared/admin/review-form";

const CreateUserReview = async () => {
  const session = await auth();

  return (
    <>
      <h1 className="h2-bold">Създай ревю</h1>

      <div className="my-8">
        <CreateReviewForm user={session?.user} userRole={session?.user.role} />
      </div>
    </>
  );
};
export default CreateUserReview;
