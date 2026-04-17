/*
  Warnings:

  - The `genre` column on the `Media` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'SciFi', 'Thriller', 'War');

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "genre",
ADD COLUMN     "genre" "Genre"[];
