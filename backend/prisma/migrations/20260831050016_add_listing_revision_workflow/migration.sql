-- CreateEnum
CREATE TYPE "RevisionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ListingStatus" ADD VALUE 'CHANGES_PENDING_REVIEW';
ALTER TYPE "ListingStatus" ADD VALUE 'REJECTED_CHANGES';

-- AlterTable
ALTER TABLE "ListingMedia" ADD COLUMN     "listingRevisionId" TEXT;

-- CreateTable
CREATE TABLE "ListingRevision" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "status" "RevisionStatus" NOT NULL DEFAULT 'PENDING',
    "proposedData" JSONB NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "rejectionReason" TEXT,

    CONSTRAINT "ListingRevision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ListingRevision_listingId_status_idx" ON "ListingRevision"("listingId", "status");

-- AddForeignKey
ALTER TABLE "ListingMedia" ADD CONSTRAINT "ListingMedia_listingRevisionId_fkey" FOREIGN KEY ("listingRevisionId") REFERENCES "ListingRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingRevision" ADD CONSTRAINT "ListingRevision_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingRevision" ADD CONSTRAINT "ListingRevision_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
