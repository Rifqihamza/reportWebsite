/*
  Warnings:

  - A unique constraint covering the columns `[lowercased_username]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `account_name` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lowercased_username` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `recordedactivity` DROP FOREIGN KEY `RecordedActivity_account_name_fkey`;

-- DropIndex
DROP INDEX `RecordedActivity_account_name_fkey` ON `recordedactivity`;

-- AlterTable
ALTER TABLE `recordedactivity` MODIFY `activity_type` ENUM('UpdateUser', 'LoginUser', 'LogoutUser', 'CreateUser', 'CreateReport', 'GetReport', 'UpdateReport', 'DeleteReport', 'CreatePIC') NOT NULL;

-- AlterTable
ALTER TABLE `report` ADD COLUMN `account_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `image_after_finish` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `inactive` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `lowercased_username` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Users_lowercased_username_key` ON `Users`(`lowercased_username`);

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_account_name_fkey` FOREIGN KEY (`account_name`) REFERENCES `Users`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordedActivity` ADD CONSTRAINT `RecordedActivity_account_name_fkey` FOREIGN KEY (`account_name`) REFERENCES `Users`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;
