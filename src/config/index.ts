import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  PORT,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  JSON_LIMIT,
  DB_LOCATION,
  DB_CLOUD_NAME,
  DB_CLOUD_PASSWORD,
  DB_CLOUD_CLUSTER,
  HOST_PATH,
  TOKEN_EXPIRE,
  REFRESH_EXPIRE,
} = process.env;
