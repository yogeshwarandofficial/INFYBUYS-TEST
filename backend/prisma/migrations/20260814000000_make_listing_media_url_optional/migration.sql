-- AlterTable
ALTER TABLE "ListingMedia" ADD COLUMN "s3Key" TEXT;
ALTER TABLE "ListingMedia" ALTER COLUMN "url" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");
