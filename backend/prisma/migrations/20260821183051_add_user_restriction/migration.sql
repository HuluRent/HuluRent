-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isRestricted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "restrictionReason" TEXT;
