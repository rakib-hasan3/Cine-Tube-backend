/*
  Warnings:

  - You are about to drop the column `planExpiresAt` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `subscription` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "planExpiresAt",
DROP COLUMN "subscription";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "planExpiresAt" TIMESTAMP(3),
ADD COLUMN     "subscription" "SubscriptionPlan" NOT NULL DEFAULT 'FREE';
