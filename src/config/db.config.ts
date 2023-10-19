import mongoose from "mongoose";
import config from "./env.config";
import { errorLogger, infoLogger, successLogger } from "../utils/logger";

const { NODE_ENV, DEV_MONGO_URI, TEST_MONGO_URI, PROD_MONGO_URI } = config;

export const connection = async () => {
  try {
    let connect;
    switch (NODE_ENV) {
      case "development":
        connect = await mongoose.connect(DEV_MONGO_URI).catch((e) => {
          errorLogger.log(`Connection did not succeed${e}`);
          process.exit(1);
        });
        break;
      case "staging":
        connect = await mongoose.connect(TEST_MONGO_URI).catch((e) => {
          errorLogger.log(`Connection did not succeed${e}`);
          process.exit(1);
        });
        break;
      case "production":
        connect = await mongoose.connect(PROD_MONGO_URI).catch((e) => {
          errorLogger.log(`Connection did not succeed${e}`);
          process.exit(1);
        });
        break;
      default:
        errorLogger.log("Environment not defined");
        process.exit(1);
    }
    successLogger.log(
      `Connected to MongoDB in ${NODE_ENV} mode on ${connect.connection.host}`,
    );
  } catch (error) {
    return error;
  }
};

export const dropDB = async () => {
  try {
    for (const collection in mongoose.connection.collections) {
      mongoose.connection.collections[collection].drop().then(() => {
        successLogger.log(`${collection} dropped!!`);
      });
    }
  } catch (error) {
    throw error;
  }
};

export const dropCollection = async (collection: string) => {
  try {
    mongoose.connection.collections[collection].drop().then(() => {
      infoLogger.log(`${collection} dropped`);
    });
  } catch (error) {
    throw error;
  }
};
