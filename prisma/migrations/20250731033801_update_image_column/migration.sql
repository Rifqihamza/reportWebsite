/*
  Warnings:

  - Made the column `image` on table `report` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `report` MODIFY `image` VARCHAR(191) NOT NULL;
