-- AlterTable
ALTER TABLE "Part" ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "price" SET DATA TYPE TEXT,
ALTER COLUMN "quantity" DROP NOT NULL,
ALTER COLUMN "quantity" SET DATA TYPE TEXT;
