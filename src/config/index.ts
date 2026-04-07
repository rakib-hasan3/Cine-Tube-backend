import dotenv from 'dotenv';
import path from 'path';
import { Client } from 'pg';

dotenv.config({ path: path.join(process.cwd(), '.env') });
console.log("Loaded CLIENT_URL:", process.env.CLIENT_URL);
export default {
  NODE_ENV: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000', bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUND),
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  database_url: process.env.DATABASE_URL,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,

};
