import { Types } from "mongoose";
import {
  AccountStatus,
  AccountType,
  OrderStatus,
  OtpType,
  PaymentReason,
  PaymentStatus,
  RequestStatus,
  StaffRole,
} from "../../constants/enums";

interface PersonalDetail {
  fullName: string;
  email?: string;
  phone?: string;
}

interface ITimeStamps {
  _id: Types.ObjectId;
  createdAt: string;
  updatedAt: string;
}

export interface IFulfilledPayment {
  amount: number;
  checkImage: string;
  isConfirmed: boolean;
  paymentRef: string;
}

export interface IAccount extends ITimeStamps {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  accountType: keyof typeof AccountType;
  accountStatus: keyof typeof AccountStatus;
}
export interface IRequest extends ITimeStamps {
  fullName: string;
  email?: string;
  phoneNumber: string;
  state?: string;
  city?: string;
  zipCode?: string;
  service: string;
  date: string;
  detail?: string;
  requestStatus: keyof typeof RequestStatus;
  createdBy?: string | Types.ObjectId | IAccount;
  order?: string | Types.ObjectId | IOrder;
  closedBy?: string | Types.ObjectId | IAccount;
}
export interface IOrder extends ITimeStamps {
  request: string | Types.ObjectId | IRequest;
  orderId: string;
  acceptedDate: string;
  cost: number;
  orderStatus: keyof typeof OrderStatus;
  cancelReason?: string;
  canceledBy?: string | Types.ObjectId | IAccount;
  payment?: string | Types.ObjectId | ITransaction;
  assignedAgent: string | Types.ObjectId | IAccount;
}
export interface ITransaction extends ITimeStamps {
  from: PersonalDetail;
  reason: keyof typeof PaymentReason;
  amount: number;
  paymentStatus: keyof typeof PaymentStatus;
  fulfilledPayments: Types.Array<IFulfilledPayment>;
}
export interface IStaff extends ITimeStamps {
  account: string | Types.ObjectId | IAccount;
  staff: string | Types.ObjectId | IAccount;
  role: keyof typeof StaffRole;
  staffStatus: keyof typeof AccountStatus;
}
export interface IOtp extends ITimeStamps {
  account: string | Types.ObjectId | IAccount;
  otp: string;
  type: keyof typeof OtpType;
  try: number;
  expires_at: string;
  expired: boolean;
}
