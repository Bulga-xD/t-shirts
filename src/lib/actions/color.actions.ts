import { db } from "@/database/client";

export const getColors = async () => {
  return await db.color.findMany();
};

export const getColorById = async (id: string) => {
  return await db.color.findUnique({
    where: {
      id,
    },
  });
};
