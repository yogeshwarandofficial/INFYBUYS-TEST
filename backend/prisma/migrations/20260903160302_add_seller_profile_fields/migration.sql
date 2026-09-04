-- AlterTable
ALTER TABLE "SellerProfile" ADD COLUMN     "avatarKey" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "jobTitle" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "preferredCategories" TEXT[],
ADD COLUMN     "preferredLocations" TEXT[],
ADD COLUMN     "sellerType" TEXT,
ADD COLUMN     "website" TEXT,
ADD COLUMN     "yearsOfExperience" TEXT;
