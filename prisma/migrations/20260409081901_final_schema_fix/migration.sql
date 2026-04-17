/*
  Warnings:

  - The values [Action,Adventure,Animation,Comedy,Crime,Documentary,Drama,Family,Fantasy,Horror,Mystery,Romance,SciFi,Thriller,War] on the enum `Genre` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Genre_new" AS ENUM ('ACTION', 'DRAMA', 'THRILLER', 'COMEDY', 'ROMANCE');
ALTER TABLE "Media" ALTER COLUMN "genre" TYPE "Genre_new"[] USING ("genre"::text::"Genre_new"[]);
ALTER TYPE "Genre" RENAME TO "Genre_old";
ALTER TYPE "Genre_new" RENAME TO "Genre";
DROP TYPE "public"."Genre_old";
COMMIT;
