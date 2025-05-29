-- DropForeignKey
ALTER TABLE `report` DROP FOREIGN KEY `Report_pic_name_fkey`;

-- DropIndex
DROP INDEX `Report_pic_name_fkey` ON `report`;

-- AlterTable
ALTER TABLE `report` MODIFY `image` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Report_PIC` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Report_PIC_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Report_Location` (
    `id` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Report_Location_location_key`(`location`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_pic_name_fkey` FOREIGN KEY (`pic_name`) REFERENCES `Report_PIC`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_location_fkey` FOREIGN KEY (`location`) REFERENCES `Report_Location`(`location`) ON DELETE SET NULL ON UPDATE CASCADE;
