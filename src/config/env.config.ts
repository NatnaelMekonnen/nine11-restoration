import dotenv from "dotenv";

dotenv.config();

interface Environment {
  NODE_ENV: string;
  PORT?: string;
  ORIGIN?: string;
  JWT_SECRET: string;
  DEV_MONGO_URI: string;
  TEST_MONGO_URI: string;
  PROD_MONGO_URI: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_BUCKET_NAME: string;
  AWS_REGION: string;
  FRONT_URL?: string;
  SEND_GRIDE_API_KEY?: string;
  SENDER?: string;
}

const {
  NODE_ENV,
  PORT,
  ORIGIN,
  JWT_SECRET,
  DEV_MONGO_URI,
  TEST_MONGO_URI,
  PROD_MONGO_URI,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME,
  AWS_REGION,
  SEND_GRIDE_API_KEY,
  SENDER,
} = process.env;

if (
  !NODE_ENV ||
  !JWT_SECRET ||
  !DEV_MONGO_URI ||
  !TEST_MONGO_URI ||
  !PROD_MONGO_URI ||
  !AWS_ACCESS_KEY_ID ||
  !AWS_SECRET_ACCESS_KEY ||
  !AWS_BUCKET_NAME ||
  !AWS_REGION
) {
  throw new Error("Check .env");
}

const config: Environment = {
  NODE_ENV,
  PORT,
  ORIGIN,
  JWT_SECRET,
  DEV_MONGO_URI,
  TEST_MONGO_URI,
  PROD_MONGO_URI,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME,
  AWS_REGION,
  SEND_GRIDE_API_KEY,
  SENDER,
};

export default config;
