import { Schema, model } from "mongoose";
import Account from "./Account";
import { AccountStatus, StaffRole } from "../constants/enums";
import { IStaff } from "./interface";

const staffSchema = new Schema<IStaff>(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: Account,
      required: true,
    },
    staff: {
      type: Schema.Types.ObjectId,
      ref: Account,
      required: true,
    },
    role: {
      type: String,
      enum: StaffRole,
      default: StaffRole.FieldAgent,
      required: true,
    },
    staffStatus: {
      type: String,
      enum: AccountStatus,
      default: AccountStatus.Active,
      required: true,
    },
  },
  { timestamps: true },
);

const Staff = model("Staff", staffSchema);

export default Staff;
