import { db } from "@/database/client";

export const getSizes = async () => {
  return await db.size.findMany();
};
