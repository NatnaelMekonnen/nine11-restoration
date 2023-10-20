import { Schema, model } from "mongoose";
import PasswordManager from "../helpers/PasswordManager";
import { AccountStatus, AccountType } from "../constants/enums";
import { IAccount } from "./interface";

const accountSchema = new Schema<IAccount>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: AccountType,
      default: AccountType.Customer,
      required: true,
    },
    accountStatus: {
      type: String,
      enum: AccountStatus,
      default: AccountStatus.Active,
      required: true,
    },
  },
  { timestamps: true },
);

accountSchema.pre("save", async function preSave(next) {
  if (!this.isModified("password")) {
    return next();
  }
  if (this.password) {
    this.password = await new PasswordManager(10).hashPassword(this.password);
  }
  next();
});

accountSchema.post(
  "save",
  (err: unknown, _: unknown, next: (error: Error) => void): void => {
    const error = err as Error & {
      name: string;
      code: number;
      keyValue: string[];
    };
    if (error.name === "MongoServerError" && error.code === 11000) {
      next(new Error(`${Object.keys(error.keyValue)[0]} is already in Use!`));
    } else {
      next(error);
    }
  },
);

const Account = model("Account", accountSchema);

export default Account;
