-- AlterTable
ALTER TABLE `report` MODIFY `follow_up` ENUM('Admin', 'Guru', 'Siswa', 'Vendor', 'Tukang') NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('Admin', 'Guru', 'Siswa', 'Vendor', 'Tukang') NOT NULL;
