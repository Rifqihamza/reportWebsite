/*
  Warnings:

  - Added the required column `campus_name` to the `Report_Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `report_location` ADD COLUMN `campus_name` ENUM('MI', 'PD', 'PATI', 'AMI', 'MOJO') NOT NULL;
