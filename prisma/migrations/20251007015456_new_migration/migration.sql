/*
  Warnings:

  - You are about to drop the column `message` on the `recordedactivity` table. All the data in the column will be lost.
  - You are about to drop the column `location_id` on the `report` table. All the data in the column will be lost.
  - You are about to drop the column `pic_id` on the `report` table. All the data in the column will be lost.
  - You are about to drop the `report_pic` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[location]` on the table `Report_Location` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[location,pic_name]` on the table `Report_Location` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ip_address` to the `RecordedActivity` table without a default value. This is not possible if the table is not empty.
  - Made the column `pic_name` on table `report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location_name` on table `report` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `pic_name` to the `Report_Location` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `report` DROP FOREIGN KEY `Report_location_id_location_name_fkey`;

-- DropForeignKey
ALTER TABLE `report` DROP FOREIGN KEY `Report_pic_id_pic_name_fkey`;

-- DropIndex
DROP INDEX `Report_location_id_location_name_fkey` ON `report`;

-- DropIndex
DROP INDEX `Report_pic_id_pic_name_fkey` ON `report`;

-- DropIndex
DROP INDEX `Report_Location_id_location_key` ON `report_location`;

-- DropIndex
DROP INDEX `Report_Location_location_campus_name_key` ON `report_location`;

-- AlterTable
ALTER TABLE `recordedactivity` DROP COLUMN `message`,
    ADD COLUMN `ip_address` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `report` DROP COLUMN `location_id`,
    DROP COLUMN `pic_id`,
    MODIFY `pic_name` VARCHAR(191) NOT NULL,
    MODIFY `location_name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `report_location` ADD COLUMN `pic_name` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `report_pic`;

-- CreateIndex
CREATE UNIQUE INDEX `Report_Location_location_key` ON `Report_Location`(`location`);

-- CreateIndex
CREATE UNIQUE INDEX `Report_Location_location_pic_name_key` ON `Report_Location`(`location`, `pic_name`);

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_location_name_pic_name_fkey` FOREIGN KEY (`location_name`, `pic_name`) REFERENCES `Report_Location`(`location`, `pic_name`) ON DELETE CASCADE ON UPDATE CASCADE;
