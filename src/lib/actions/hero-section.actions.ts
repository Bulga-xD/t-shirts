"use server";

import { db } from "@/database/client";
import { formatError } from "../utils";
import { PAGE_SIZE } from "../constants";
import { z } from "zod";
import { insertHeroSection, updateHeroSection } from "../validators";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { utapi } from "@/app/server/upladthing";

export const getHeroData = async () => {
  try {
    const data = await db.heroSection.findMany({
      include: {
        images: true,
      },
      where: {
        isActive: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const dataCount = await db.heroSection.count();

    return {
      data,
      totalPages: Math.ceil(dataCount / PAGE_SIZE),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const createHeroData = async (
  data: z.infer<typeof insertHeroSection>
) => {
  try {
    const heroData = insertHeroSection.parse(data);

    await db.heroSection.create({
      data: {
        text: heroData.text,
        images: {
          create:
            heroData.images?.map((image) => ({
              image: image.image,
              imageKey: image.imageKey,
            })) || [],
        },
        isActive: heroData.isActive,
      },
    });

    return { success: true, message: "Hero section successfully added" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const updateHeroData = async (
  data: z.infer<typeof updateHeroSection>
) => {
  try {
    const heroData = updateHeroSection.parse(data);

    const heroSectionExists = await db.heroSection.findUnique({
      where: { id: heroData.id },
    });
    if (!heroSectionExists) {
      return { success: false, message: "Hero section not found" };
    }

    await db.heroSection.update({
      where: { id: heroData.id },
      data: {
        text: heroData.text,
        images: {
          deleteMany: {},
          create:
            heroData.images?.map((image) => ({
              image: image.image,
              imageKey: image.imageKey,
            })) || [],
        },
        isActive: heroData.isActive,
      },
    });

    return { success: true, message: "Hero section successfully updated" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const deleteHeroData = async (id: string) => {
  try {
    const itemExists = await db.heroSection.findUnique({
      where: { id },
    });

    if (!itemExists) throw new Error("Търсен елемент не е намерен");

    await db.heroSection.delete({ where: { id } });
    revalidatePath("/admin/hero-section");
    return { success: true, message: "Успешно изтрита снимка" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const getSingleHeroData = async (id: string) => {
  const heroData = await db.heroSection.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });
  if (!heroData) {
    notFound();
  }
  return heroData;
};

export const imageRemove = async (imageKey: string) => {
  try {
    await utapi.deleteFiles(imageKey);
    return { success: true, message: "Успешно изтрита снимка" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};
