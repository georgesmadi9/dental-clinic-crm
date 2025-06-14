/*
  Warnings:

  - The primary key for the `Case` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Case" DROP CONSTRAINT "Case_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Case_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Case_id_seq";
