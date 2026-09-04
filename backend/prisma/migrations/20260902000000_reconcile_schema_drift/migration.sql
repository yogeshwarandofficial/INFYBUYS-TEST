-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('PENDING', 'SELLER_RESPONDED', 'IN_DISCUSSION', 'NDA_REQUESTED', 'NDA_SIGNED', 'CLOSED', 'REJECTED');

-- AlterTable
ALTER TABLE "Enquiry" ADD COLUMN "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "status" "EnquiryStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "SavedSearch" ADD COLUMN "category" TEXT,
ADD COLUMN "listingType" "ListingType",
ADD COLUMN "location" TEXT,
ADD COLUMN "maxPrice" DECIMAL(12,2),
ADD COLUMN "minPrice" DECIMAL(12,2),
ADD COLUMN "name" TEXT NOT NULL DEFAULT 'Saved Search',
ADD COLUMN "search" TEXT,
ALTER COLUMN "filtersJson" DROP NOT NULL,
ALTER COLUMN "alertFrequency" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Favorite_buyerId_idx" ON "Favorite"("buyerId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_buyerId_listingId_key" ON "Favorite"("buyerId", "listingId");

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
