import { Schema, model } from "mongoose";
import { PaymentReason, PaymentStatus } from "../constants/enums";
import { ITransaction } from "./interface";

const transactionSchema = new Schema<ITransaction>(
  {
    amount: {
      type: Number,
      default: 0,
      required: true,
    },
    from: {
      fullName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
    paymentStatus: {
      type: String,
      enum: PaymentStatus,
      default: PaymentStatus.Pending,
    },
    reason: {
      type: String,
      enum: PaymentReason,
    },
  },
  { timestamps: true },
);

const Transaction = model("Transaction", transactionSchema);

export default Transaction;
