/*
  Warnings:

  - You are about to drop the `reporttoken` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `report` MODIFY `pic_name` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `reporttoken`;

-- CreateTable
CREATE TABLE `VerifiedCaptcha` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expire_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `VerifiedCaptcha_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_pic_name_fkey` FOREIGN KEY (`pic_name`) REFERENCES `Users`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;
