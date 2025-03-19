-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" DATETIME,
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false
);

-- CreateTable
CREATE TABLE "QRCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productHandle" TEXT NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "scans" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TobaccoForm" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "validIdFileUrl" TEXT NOT NULL DEFAULT '',
    "businessName" TEXT NOT NULL,
    "businessAddress1" TEXT NOT NULL,
    "businessAddress2" TEXT,
    "businessCity" TEXT NOT NULL,
    "businessState" TEXT NOT NULL,
    "businessZip" TEXT NOT NULL,
    "ein" TEXT NOT NULL DEFAULT '',
    "einFileUrl" TEXT NOT NULL DEFAULT '',
    "salesAndUseTaxPermitNumber" TEXT DEFAULT '',
    "salesAndUseTaxFileUrl" TEXT NOT NULL DEFAULT '',
    "tobaccoPermitNumber" TEXT DEFAULT '',
    "tobaccoPermitExpirationDate" DATETIME,
    "tobaccoPermitFileUrl" TEXT DEFAULT '',
    "approved" BOOLEAN DEFAULT false,
    "shopifyAccountId" TEXT DEFAULT '',
    "erplyCustomerId" INTEGER DEFAULT -1,
    "erplyAddressId" INTEGER DEFAULT -1
);

-- CreateTable
CREATE TABLE "ContactPerson" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "validIdFileUrl" TEXT NOT NULL DEFAULT '',
    "shopifyAccountId" TEXT DEFAULT '',
    "erplyContactPersonId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Business" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "businessName" TEXT NOT NULL,
    "businessAddress1" TEXT NOT NULL,
    "businessAddress2" TEXT,
    "businessCity" TEXT NOT NULL,
    "businessState" TEXT NOT NULL,
    "businessZip" TEXT NOT NULL,
    "ein" TEXT NOT NULL DEFAULT '',
    "einFileUrl" TEXT NOT NULL DEFAULT '',
    "salesAndUseTaxPermitNumber" TEXT DEFAULT '',
    "salesAndUseTaxFileUrl" TEXT NOT NULL DEFAULT '',
    "tobaccoPermitNumber" TEXT DEFAULT '',
    "tobaccoPermitExpirationDate" DATETIME,
    "tobaccoPermitFileUrl" TEXT DEFAULT '',
    "approved" BOOLEAN DEFAULT false,
    "erplyBusinessId" INTEGER DEFAULT -1,
    "erplyAddressId" INTEGER DEFAULT -1,
    CONSTRAINT "Business_id_fkey" FOREIGN KEY ("id") REFERENCES "ContactPerson" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
