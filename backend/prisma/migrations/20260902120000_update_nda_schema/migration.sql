-- CreateEnum
CREATE TYPE "NdaStatus" AS ENUM ('REQUESTED', 'SIGNED');

-- Rename table
ALTER TABLE "ListingNdaAcceptance" RENAME TO "NdaAgreement";

-- Add columns
ALTER TABLE "NdaAgreement" ADD COLUMN "status" "NdaStatus" NOT NULL DEFAULT 'REQUESTED';
ALTER TABLE "NdaAgreement" ADD COLUMN "ndaVersion" TEXT NOT NULL DEFAULT '1.0';
ALTER TABLE "NdaAgreement" ADD COLUMN "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "NdaAgreement" ADD COLUMN "signedAt" TIMESTAMP(3);

-- Migrate data: Previous rows represent accepted NDAs
UPDATE "NdaAgreement" SET "status" = 'SIGNED', "signedAt" = "acceptedAt";

-- Drop old column
ALTER TABLE "NdaAgreement" DROP COLUMN "acceptedAt";

-- Rename indexes for consistency (optional but safe)
ALTER INDEX "ListingNdaAcceptance_listingId_buyerId_key" RENAME TO "NdaAgreement_listingId_buyerId_key";
ALTER INDEX "ListingNdaAcceptance_pkey" RENAME TO "NdaAgreement_pkey";
