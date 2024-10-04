import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getUserById } from "@/lib/actions/user.actions";
import { APP_NAME } from "@/lib/constants";

import UpdateUserForm from "./update-user-form";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: `Update user - ${APP_NAME}`,
};

export default async function UpdateUserPage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const user = await getUserById(id);
  const session = await auth();
  if (!user) notFound();
  if (user.role === "superAdmin" && session?.user.role !== "superAdmin")
    return notFound();

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h1 className="h2-bold">Редактирай потребител</h1>
      <UpdateUserForm user={user} />
    </div>
  );
}
