/*
  Warnings:

  - You are about to drop the column `days` on the `monthly-deal` table. All the data in the column will be lost.
  - You are about to drop the column `hours` on the `monthly-deal` table. All the data in the column will be lost.
  - You are about to drop the column `minutes` on the `monthly-deal` table. All the data in the column will be lost.
  - You are about to drop the column `seconds` on the `monthly-deal` table. All the data in the column will be lost.
  - The primary key for the `orderItems` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `stock` on the `product` table. All the data in the column will be lost.
  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[orderId,productId,size,color]` on the table `orderItems` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imageKey` to the `hero-image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `monthly-deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `monthly-deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color` to the `orderItems` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `orderItems` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `size` on table `orderItems` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('superAdmin', 'admin', 'user');

-- AlterTable
ALTER TABLE "UserReview" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "hero-image" ADD COLUMN     "heroSectionId" TEXT,
ADD COLUMN     "imageKey" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "monthly-deal" DROP COLUMN "days",
DROP COLUMN "hours",
DROP COLUMN "minutes",
DROP COLUMN "seconds",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orderItems" DROP CONSTRAINT "orderItems_pkey",
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "size" SET NOT NULL,
ADD CONSTRAINT "orderItems_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "product" DROP COLUMN "stock",
ADD COLUMN     "discount" DECIMAL(65,30),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user';

-- CreateTable
CREATE TABLE "Size" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Size_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Color" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant" (
    "id" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "sizeId" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,

    CONSTRAINT "product_variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero-section" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero-section_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Size_id_key" ON "Size"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Color_id_key" ON "Color"("id");

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_productId_sizeId_colorId_key" ON "product_variant"("productId", "sizeId", "colorId");

-- CreateIndex
CREATE UNIQUE INDEX "orderItems_orderId_productId_size_color_key" ON "orderItems"("orderId", "productId", "size", "color");

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hero-image" ADD CONSTRAINT "hero-image_heroSectionId_fkey" FOREIGN KEY ("heroSectionId") REFERENCES "hero-section"("id") ON DELETE SET NULL ON UPDATE CASCADE;
