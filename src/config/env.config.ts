import Joi from "joi";
import dotenv from "dotenv";
import { errorLogger } from "../utils/logger";

dotenv.config();

interface Environment {
  NODE_ENV: string;
  PORT?: string;
  ORIGIN?: string;
  GATEWAY: string;
  JWT_SECRET: string;
  DEV_MONGO_URI: string;
  TEST_MONGO_URI: string;
  PROD_MONGO_URI: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_BUCKET_NAME: string;
  AWS_REGION: string;
  FRONT_URL: string;
}

const {
  NODE_ENV,
  PORT,
  ORIGIN,
  GATEWAY,
  JWT_SECRET,
  DEV_MONGO_URI,
  TEST_MONGO_URI,
  PROD_MONGO_URI,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME,
  AWS_REGION,
  FRONT_URL,
} = process.env;

const envSchema = Joi.object<Environment>({
  NODE_ENV: Joi.string()
    .valid("development", "staging", "production")
    .required(),
  ORIGIN: Joi.string().when("NODE_ENV", {
    not: "development",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  JWT_SECRET: Joi.string().required(),
  DEV_MONGO_URI: Joi.string().required(),
  TEST_MONGO_URI: Joi.string().required(),
  PROD_MONGO_URI: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_BUCKET_NAME: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
}).unknown();
const result = envSchema.validate(process.env);

if (result.error) {
  errorLogger.log(result.error.details);
  throw new Error(result.error.message);
}

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
  GATEWAY: GATEWAY || "",
  JWT_SECRET,
  DEV_MONGO_URI,
  TEST_MONGO_URI,
  PROD_MONGO_URI,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME,
  AWS_REGION,
  FRONT_URL: FRONT_URL || "",
};

export default config;
