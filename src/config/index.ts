import dotenv from 'dotenv';
import path from 'path';

// .env ফাইল লোড করার চেষ্টা (যদি কাজ করে)
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  NODE_ENV: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUND),
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  database_url: process.env.DATABASE_URL,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,

  // সরাসরি কী বসিয়ে দাও (এভাবে দিলে .env এর ওপর নির্ভর করতে হবে না)
  gemini_api_key: "AIzaSyC93OmzomdC8cx5LxduOmDX0GCB2KDIDaw",

  // Email Config
  email_user: process.env.EMAIL_USER,
  email_pass: process.env.EMAIL_PASS,
};