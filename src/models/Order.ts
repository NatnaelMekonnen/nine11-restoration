import moment from "moment";
import { Schema, model } from "mongoose";
import Account from "./Account";
import Transaction from "./Transaction";
import { OrderStatus } from "../constants/enums";
import { IOrder } from "./interface";

const orderSchema = new Schema<IOrder>(
  {
    acceptedDate: {
      type: String,
      default: moment().toISOString(),
    },
    canceledBy: {
      type: Schema.Types.ObjectId,
      ref: Account,
    },
    cancelReason: {
      type: String,
    },
    cost: {
      type: Number,
      required: true,
      default: 0,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    orderStatus: {
      type: String,
      enum: OrderStatus,
      default: OrderStatus.Pending,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: Transaction,
      required: true,
    },
    assignedAgent: {
      type: Schema.Types.ObjectId,
      ref: Account,
    },
  },
  { timestamps: true },
);

const Order = model("Order", orderSchema);

export default Order;
