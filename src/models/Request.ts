import { model } from "mongoose";
import { Schema } from "mongoose";
import Account from "./Account";
import moment from "moment";
import Order from "./Order";
import { RequestStatus } from "../constants/enums";
import { IRequest } from "./interface";

const requestSchema = new Schema<IRequest>(
  {
    canceledBy: {
      type: Schema.Types.ObjectId,
      ref: Account,
    },
    city: {
      type: String,
    },
    date: {
      type: String,
      default: moment().toISOString(),
      required: true,
    },
    detail: {
      type: String,
    },
    email: {
      type: String,
    },
    fullName: {
      type: String,
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: Order,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    requestStatus: {
      type: String,
      enum: RequestStatus,
      default: RequestStatus.Pending,
    },
    service: {
      type: String,
    },
    state: {
      type: String,
    },
    zipCode: {
      type: String,
    },
  },
  { timestamps: true },
);

const Request = model("Request", requestSchema);

export default Request;
