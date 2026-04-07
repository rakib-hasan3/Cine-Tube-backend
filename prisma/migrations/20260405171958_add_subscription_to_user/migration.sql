-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_mediaId_fkey";

-- AlterTable
ALTER TABLE "Purchase" ALTER COLUMN "mediaId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "planExpiresAt" TIMESTAMP(3),
ADD COLUMN     "subscription" "SubscriptionPlan" NOT NULL DEFAULT 'FREE';

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
