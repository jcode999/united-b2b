-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TobaccoForm" (
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
    "tobaccoPermitNumber" TEXT,
    "tobaccoPermitExpirationDate" DATETIME,
    "tobaccoPermitFileUrl" TEXT,
    "approved" BOOLEAN DEFAULT false,
    "shopifyAccountId" TEXT DEFAULT ''
);
INSERT INTO "new_TobaccoForm" ("approved", "businessAddress1", "businessAddress2", "businessCity", "businessName", "businessState", "businessZip", "email", "firstName", "id", "lastName", "phoneNumber", "salesAndUseTaxFileUrl", "salesAndUseTaxPermitNumber", "shopifyAccountId", "tobaccoPermitExpirationDate", "tobaccoPermitFileUrl", "tobaccoPermitNumber", "validIdFileUrl") SELECT "approved", "businessAddress1", "businessAddress2", "businessCity", "businessName", "businessState", "businessZip", "email", "firstName", "id", "lastName", "phoneNumber", "salesAndUseTaxFileUrl", "salesAndUseTaxPermitNumber", "shopifyAccountId", "tobaccoPermitExpirationDate", "tobaccoPermitFileUrl", "tobaccoPermitNumber", "validIdFileUrl" FROM "TobaccoForm";
DROP TABLE "TobaccoForm";
ALTER TABLE "new_TobaccoForm" RENAME TO "TobaccoForm";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
