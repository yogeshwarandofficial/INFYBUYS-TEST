-- CreateEnum
CREATE TYPE "KycDocumentType" AS ENUM ('IDENTITY', 'BUSINESS_PROOF', 'ADDRESS_PROOF', 'OTHER');

-- AlterTable
ALTER TABLE "SellerProfile" ADD COLUMN     "businessAddress" TEXT,
ADD COLUMN     "kycRejectionReason" TEXT,
ADD COLUMN     "kycReviewedAt" TIMESTAMP(3),
ADD COLUMN     "kycReviewedBy" TEXT,
ADD COLUMN     "kycSubmittedAt" TIMESTAMP(3),
ADD COLUMN     "legalName" TEXT,
ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "SellerKycDocument" (
    "id" TEXT NOT NULL,
    "sellerProfileId" TEXT NOT NULL,
    "documentType" "KycDocumentType" NOT NULL,
    "s3Key" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,

    CONSTRAINT "SellerKycDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SellerKycDocument_sellerProfileId_idx" ON "SellerKycDocument"("sellerProfileId");

-- AddForeignKey
ALTER TABLE "SellerKycDocument" ADD CONSTRAINT "SellerKycDocument_sellerProfileId_fkey" FOREIGN KEY ("sellerProfileId") REFERENCES "SellerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
