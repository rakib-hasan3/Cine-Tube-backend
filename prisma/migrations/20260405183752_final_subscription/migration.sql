-- AlterEnum
ALTER TYPE "PriceType" ADD VALUE 'FAMILY';

-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "subscriptionPlan" "SubscriptionPlan";
