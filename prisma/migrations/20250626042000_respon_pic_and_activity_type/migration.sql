/*
  Warnings:

  - You are about to alter the column `submitted_by` on the `report` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to alter the column `follow_up_name` on the `report` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Users_email_key` ON `users`;

-- AlterTable
ALTER TABLE `report` MODIFY `submitted_by` VARCHAR(30) NOT NULL,
    MODIFY `message` VARCHAR(200) NOT NULL,
    MODIFY `follow_up_name` VARCHAR(30) NULL,
    MODIFY `detail_location` VARCHAR(200) NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `email`;

-- CreateTable
CREATE TABLE `RecordedActivity` (
    `id` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `activity_type` ENUM('CreateReport', 'GetReport', 'UpdateReport', 'DeleteReport', 'CreatePIC', 'LoginUser', 'LogoutUser') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `account_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RecordedActivity` ADD CONSTRAINT `RecordedActivity_account_name_fkey` FOREIGN KEY (`account_name`) REFERENCES `Users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;
