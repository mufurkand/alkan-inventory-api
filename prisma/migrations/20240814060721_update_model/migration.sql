/*
  Warnings:

  - You are about to drop the `Component` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Component";

-- CreateTable
CREATE TABLE "Part" (
    "id" SERIAL NOT NULL,
    "materialType" TEXT NOT NULL,
    "partNumber" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "price" DECIMAL(12,2),
    "quantity" INTEGER NOT NULL,
    "channel" TEXT,
    "caseType" TEXT,
    "voltage" TEXT,
    "current" TEXT,
    "value" TEXT,
    "unit" TEXT,
    "power" TEXT,
    "description" TEXT,
    "image" BYTEA,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Part_partNumber_key" ON "Part"("partNumber");
