/*
  Warnings:

  - Added the required column `text` to the `UserReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserReview" ADD COLUMN     "text" TEXT NOT NULL;