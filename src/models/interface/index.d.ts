import { Types } from "mongoose";

interface PersonalDetail {
  fullName: string;
  email?: string;
  phone?: string;
}

export declare global {
  enum AccountType {
    Admin = "Admin",
    Staff = "Staff",
    Customer = "Customer",
  }
  enum StaffRole {
    Admin = "Admin",
    FieldAgent = "FieldAgent",
  }
  enum AccountStatus {
    Active = "Active",
    Inactive = "Inactive",
    Suspended = "Suspended",
  }
  enum RequestStatus {
    Pending = "Pending",
    Accepted = "Accepted",
    Canceled = "Canceled",
  }
  enum OrderStatus {
    Pending = "Pending",
    Completed = "Completed",
    Canceled = "Canceled",
  }
  enum PaymentStatus {
    Pending = "Pending",
    Confirmed = "Confirmed",
    Failed = "Failed",
    Canceled = "Canceled",
  }
  enum PaymentReason {
    ServiceProvided = "ServiceProvided",
  }
  interface IAccount {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
    accountType: keyof typeof AccountType;
    accountStatus: keyof typeof AccountStatus;
  }
  interface IRequest {
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
    order?: string | Types.ObjectId | IOrder;
    canceledBy?: string | Types.ObjectId | IAccount;
  }
  interface IOrder {
    orderId: string;
    acceptedDate: string;
    cost: number;
    orderStatus: keyof typeof OrderStatus;
    cancelReason?: string;
    canceledBy?: string | Types.ObjectId | IAccount;
    payment?: string[] | Types.ObjectId[] | ITransaction[];
  }
  interface ITransaction {
    from: PersonalDetail;
    reason: keyof typeof PaymentReason;
    amount: number;
    paymentStatus: keyof typeof PaymentStatus;
  }
  interface IStaff extends IAccount {
    role: keyof typeof StaffRole;
  }
}
