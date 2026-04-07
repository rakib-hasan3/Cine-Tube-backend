/*
  Warnings:

  - The values [MONTHLY,YEARLY] on the enum `SubscriptionPlan` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionPlan_new" AS ENUM ('FREE', 'PREMIUM', 'FAMILY');
ALTER TABLE "public"."User" ALTER COLUMN "subscription" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "subscription" TYPE "SubscriptionPlan_new" USING ("subscription"::text::"SubscriptionPlan_new");
ALTER TYPE "SubscriptionPlan" RENAME TO "SubscriptionPlan_old";
ALTER TYPE "SubscriptionPlan_new" RENAME TO "SubscriptionPlan";
DROP TYPE "public"."SubscriptionPlan_old";
ALTER TABLE "User" ALTER COLUMN "subscription" SET DEFAULT 'FREE';
COMMIT;
