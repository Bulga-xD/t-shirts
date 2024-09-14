import { auth } from "@/auth";
import CreateReviewForm from "@/components/shared/admin/review-form";

const CreateUserReview = async () => {
  const session = await auth();

  return (
    <div className="space-y-8 max-w-7xl m-auto p-5 md:px-10">
      <h1 className="h2-bold">Създай ревю</h1>

      <div className="my-8">
        <CreateReviewForm user={session?.user} userRole={session?.user.role} />
      </div>
    </div>
  );
};
export default CreateUserReview;
