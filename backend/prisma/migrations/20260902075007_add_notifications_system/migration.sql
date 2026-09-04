-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_ENQUIRY', 'NEW_MESSAGE', 'KYC_APPROVED', 'KYC_REJECTED', 'LISTING_APPROVED', 'LISTING_REJECTED', 'NDA_REQUESTED', 'NDA_SIGNED', 'SAVED_SEARCH_MATCH');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");
