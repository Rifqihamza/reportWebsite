/*
  Warnings:

  - A unique constraint covering the columns `[location,campus_name]` on the table `Report_Location` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `report` DROP FOREIGN KEY `Report_location_fkey`;

-- DropIndex
DROP INDEX `Report_location_fkey` ON `report`;

-- DropIndex
DROP INDEX `Report_Location_location_key` ON `report_location`;

-- AlterTable
ALTER TABLE `report` ADD COLUMN `campus` ENUM('MI', 'PD', 'PATI', 'AMI', 'MOJO') NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Report_Location_location_campus_name_key` ON `Report_Location`(`location`, `campus_name`);

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_location_campus_fkey` FOREIGN KEY (`location`, `campus`) REFERENCES `Report_Location`(`location`, `campus_name`) ON DELETE SET NULL ON UPDATE CASCADE;
