/*
  Warnings:

  - You are about to drop the `registration` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `report` ADD COLUMN `detail_location` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `registration`;
