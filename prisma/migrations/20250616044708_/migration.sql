/*
  Warnings:

  - You are about to drop the column `location` on the `report` table. All the data in the column will be lost.
  - You are about to alter the column `campus_name` on the `report_pic` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(6))`.
  - A unique constraint covering the columns `[id,location]` on the table `Report_Location` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,name]` on the table `Report_PIC` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `report` DROP FOREIGN KEY `Report_location_id_fkey`;

-- DropForeignKey
ALTER TABLE `report` DROP FOREIGN KEY `Report_pic_id_fkey`;

-- DropIndex
DROP INDEX `Report_location_id_fkey` ON `report`;

-- DropIndex
DROP INDEX `Report_pic_id_fkey` ON `report`;

-- AlterTable
ALTER TABLE `report` DROP COLUMN `location`,
    ADD COLUMN `location_name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `report_pic` MODIFY `campus_name` ENUM('MM', 'PD', 'PATI', 'AMI', 'MOJO', 'SM', 'BBL', 'KLTN') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Report_Location_id_location_key` ON `Report_Location`(`id`, `location`);

-- CreateIndex
CREATE UNIQUE INDEX `Report_PIC_id_name_key` ON `Report_PIC`(`id`, `name`);

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_pic_id_pic_name_fkey` FOREIGN KEY (`pic_id`, `pic_name`) REFERENCES `Report_PIC`(`id`, `name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_location_id_location_name_fkey` FOREIGN KEY (`location_id`, `location_name`) REFERENCES `Report_Location`(`id`, `location`) ON DELETE SET NULL ON UPDATE CASCADE;
