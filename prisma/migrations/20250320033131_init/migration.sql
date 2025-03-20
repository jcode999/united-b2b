-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `shop` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `isOnline` BOOLEAN NOT NULL DEFAULT false,
    `scope` VARCHAR(191) NULL,
    `expires` DATETIME(3) NULL,
    `accessToken` VARCHAR(191) NOT NULL,
    `userId` BIGINT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `accountOwner` BOOLEAN NOT NULL DEFAULT false,
    `locale` VARCHAR(191) NULL,
    `collaborator` BOOLEAN NULL DEFAULT false,
    `emailVerified` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QRCode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `shop` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `productHandle` VARCHAR(191) NOT NULL,
    `productVariantId` VARCHAR(191) NOT NULL,
    `destination` VARCHAR(191) NOT NULL,
    `scans` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TobaccoForm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `validIdFileUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `businessName` VARCHAR(191) NOT NULL,
    `businessAddress1` VARCHAR(191) NOT NULL,
    `businessAddress2` VARCHAR(191) NULL,
    `businessCity` VARCHAR(191) NOT NULL,
    `businessState` VARCHAR(191) NOT NULL,
    `businessZip` VARCHAR(191) NOT NULL,
    `ein` VARCHAR(191) NOT NULL DEFAULT '',
    `einFileUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `salesAndUseTaxPermitNumber` VARCHAR(191) NULL DEFAULT '',
    `salesAndUseTaxFileUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `tobaccoPermitNumber` VARCHAR(191) NULL DEFAULT '',
    `tobaccoPermitExpirationDate` DATETIME(3) NULL,
    `tobaccoPermitFileUrl` VARCHAR(191) NULL DEFAULT '',
    `approved` BOOLEAN NULL DEFAULT false,
    `shopifyAccountId` VARCHAR(191) NULL DEFAULT '',
    `erplyCustomerId` INTEGER NULL DEFAULT -1,
    `erplyAddressId` INTEGER NULL DEFAULT -1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactPerson` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `validIdFileUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `shopifyAccountId` VARCHAR(191) NULL DEFAULT '',
    `erplyContactPersonId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Business` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `businessName` VARCHAR(191) NOT NULL,
    `businessAddress1` VARCHAR(191) NOT NULL,
    `businessAddress2` VARCHAR(191) NULL,
    `businessCity` VARCHAR(191) NOT NULL,
    `businessState` VARCHAR(191) NOT NULL,
    `businessZip` VARCHAR(191) NOT NULL,
    `ein` VARCHAR(191) NOT NULL DEFAULT '',
    `einFileUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `salesAndUseTaxPermitNumber` VARCHAR(191) NULL DEFAULT '',
    `salesAndUseTaxFileUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `tobaccoPermitNumber` VARCHAR(191) NULL DEFAULT '',
    `tobaccoPermitExpirationDate` DATETIME(3) NULL,
    `tobaccoPermitFileUrl` VARCHAR(191) NULL DEFAULT '',
    `approved` BOOLEAN NULL DEFAULT false,
    `erplyBusinessId` INTEGER NULL DEFAULT -1,
    `erplyAddressId` INTEGER NULL DEFAULT -1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Business` ADD CONSTRAINT `Business_id_fkey` FOREIGN KEY (`id`) REFERENCES `ContactPerson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
