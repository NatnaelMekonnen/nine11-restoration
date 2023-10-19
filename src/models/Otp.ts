import { Schema, model } from "mongoose";
import Account from "./Account";
import { OtpType } from "../constants/enums";
import { IOtp } from "./interface";

const otpSchema = new Schema<IOtp>(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: Account,
    },
    otp: {
      type: String,
    },
    type: {
      type: String,
      enum: OtpType,
      default: OtpType.Verification,
    },
    try: {
      type: Number,
      default: 0,
    },
    expires_at: {
      type: String,
    },
    expired: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Otp = model("Otp", otpSchema);

export default Otp;
