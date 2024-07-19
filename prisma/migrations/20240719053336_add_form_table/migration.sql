/*
  Warnings:

  - You are about to drop the column `customer_name` on the `TobaccoForm` table. All the data in the column will be lost.
  - Added the required column `customerName` to the `TobaccoForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shop` to the `TobaccoForm` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TobaccoForm" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerName" TEXT NOT NULL,
    "shop" TEXT NOT NULL
);
INSERT INTO "new_TobaccoForm" ("id") SELECT "id" FROM "TobaccoForm";
DROP TABLE "TobaccoForm";
ALTER TABLE "new_TobaccoForm" RENAME TO "TobaccoForm";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
