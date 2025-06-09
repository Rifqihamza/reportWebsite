-- DropForeignKey
ALTER TABLE `report` DROP FOREIGN KEY `Report_location_location_campus_fkey`;

-- DropForeignKey
ALTER TABLE `report` DROP FOREIGN KEY `Report_pic_name_pic_campus_fkey`;

-- DropIndex
DROP INDEX `Report_location_location_campus_fkey` ON `report`;

-- DropIndex
DROP INDEX `Report_pic_name_pic_campus_fkey` ON `report`;

-- AlterTable
ALTER TABLE `report` DROP COLUMN `location`,
    DROP COLUMN `location_campus`,
    DROP COLUMN `pic_campus`,
    DROP COLUMN `pic_name`,
    ADD COLUMN `campus` ENUM('MI', 'PD', 'PATI', 'AMI', 'MOJO') NOT NULL,
    ADD COLUMN `location_id` VARCHAR(191) NULL,
    ADD COLUMN `pic_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_pic_id_fkey` FOREIGN KEY (`pic_id`) REFERENCES `Report_PIC`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Report_Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

