/*
  Warnings:

  - Added the required column `intervention_date` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avatar` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "intervention_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "avatar" TEXT NOT NULL;
