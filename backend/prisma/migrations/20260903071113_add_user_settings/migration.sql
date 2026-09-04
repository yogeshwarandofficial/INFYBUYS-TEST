-- AlterTable
ALTER TABLE "User" ADD COLUMN     "settings" JSONB;

-- RenameForeignKey
ALTER TABLE "NdaAgreement" RENAME CONSTRAINT "ListingNdaAcceptance_buyerId_fkey" TO "NdaAgreement_buyerId_fkey";

-- RenameForeignKey
ALTER TABLE "NdaAgreement" RENAME CONSTRAINT "ListingNdaAcceptance_listingId_fkey" TO "NdaAgreement_listingId_fkey";
