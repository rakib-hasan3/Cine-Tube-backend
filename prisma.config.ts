// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "@prisma/config"; // এখানে @ যোগ করা হয়েছে

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    // এখানে 'directory' এর বদলে আবার 'path' ব্যবহার করুন
    path: "prisma/migrations",
    seed: "ts-node prisma/seed.ts"
  },
  // সিড যদি এখন প্রয়োজন না হয় তবে এই অংশটুকু কমেন্ট করে রাখতে পারেন
  /*
  seed: {
    command: "ts-node prisma/seed.ts"
  },
  */
  datasource: {
    // টাইপস্ক্রিপ্ট যাতে রাগ না করে তাই 'as string' যোগ করা ভালো
    url: process.env.DATABASE_URL as string,
  },
});