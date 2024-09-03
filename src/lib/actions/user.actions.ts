"use server";

import { isRedirectError } from "next/dist/client/components/redirect";

import { auth, signIn, signOut } from "@/auth";
import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  updateUserSchema,
} from "../validators";
import { formatError } from "../utils";
import { hashSync } from "bcrypt-ts-edge";
import { db } from "@/database/client";
import { ShippingAddress } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { PAGE_SIZE } from "../constants";

export async function signUp(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      confirmPassword: formData.get("confirmPassword"),
      password: formData.get("password"),
    });

    // Destructure and remove `confirmPassword` from the user object
    const { confirmPassword, ...userWithoutConfirmPassword } = user;

    const values = {
      id: crypto.randomUUID(),
      ...userWithoutConfirmPassword,
      password: hashSync(user.password, 10),
    };

    await db.user.create({ data: values });
    await signIn("credentials", {
      email: user.email,
      password: user.password,
    });

    return { success: true, message: "Успешна регистрация" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatError(error).includes(
        'duplicate key value violates unique constraint "user_email_idx"'
      )
        ? "Имейла вече съществува"
        : formatError(error),
    };
  }
}

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    await signIn("credentials", user);
    return { success: true, message: "Успешно вписване" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Невалиден имейл или парола" };
  }
}

export const SignOut = async () => {
  await signOut();
};

export const getUserById = async (userId: string) => {
  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!user) throw new Error("User not found");
  return user;
};

export const updateUserAddress = async (data: ShippingAddress) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("User is not authenticated");
    }

    const currentUser = await db.user.findFirst({
      where: {
        id: session?.user.id!,
      },
    });
    if (!currentUser) throw new Error("User not found");

    const address = shippingAddressSchema.parse(data);
    await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        address,
      },
    });

    revalidatePath("/place-order");
    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const updateUserPaymentMethod = async (
  data: z.infer<typeof paymentMethodSchema>
) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User is not authenticated");
    }

    const currentUser = await db.user.findFirst({
      where: {
        id: session?.user.id!,
      },
    });
    if (!currentUser) throw new Error("User not found");

    const paymentMethod = paymentMethodSchema.parse(data);

    await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        paymentMethod: paymentMethod.type,
      },
    });

    revalidatePath("/place-order");
    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User is not authenticated");
    }

    const currentUser = await db.user.findFirst({
      where: {
        id: session?.user.id!,
      },
    });
    if (!currentUser) throw new Error("User not found");

    await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
        email: user.email,
      },
    });

    return {
      success: true,
      message: "Успешно актуализиран профил",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const data = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: (page - 1) * limit,
  });
  const dataCount = await db.user.count();
  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export async function deleteUser(id: string) {
  try {
    // await db.delete(users).where(eq(users.id, id))
    await db.user.delete({
      where: {
        id,
      },
    });
    revalidatePath("/admin/users");
    return {
      success: true,
      message: "Успешно изтрит потребител",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: user.name,
        role: user.role,
      },
    });
    revalidatePath("/admin/users");
    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
