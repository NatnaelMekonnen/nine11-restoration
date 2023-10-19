import { Schema, model } from "mongoose";

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
      required: true,
    },
    phone: {
      type: String,
      default: "",
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
      default: AccountStatus.Inactive,
      required: true,
    },
  },
  { timestamps: true },
);

const Account = model("Account", accountSchema);

export default Account;
