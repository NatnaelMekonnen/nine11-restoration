export enum AccountType {
  Admin = "Admin",
  Staff = "Staff",
  Customer = "Customer",
}
export enum StaffRole {
  Admin = "Admin",
  FieldAgent = "FieldAgent",
}
export enum AccountStatus {
  Active = "Active",
  Inactive = "Inactive",
  Suspended = "Suspended",
  Deleted = "Deleted",
}
export enum RequestStatus {
  Pending = "Pending",
  Accepted = "Accepted",
  Closed = "Closed",
}
export enum OrderStatus {
  Pending = "Pending",
  Completed = "Completed",
  Closed = "Closed",
}
export enum PaymentStatus {
  Pending = "Pending",
  Successful = "Successful",
  Confirmed = "Confirmed",
  Failed = "Failed",
  Canceled = "Canceled",
}
export enum PaymentReason {
  ServiceProvided = "ServiceProvided",
}
export enum OtpType {
  Verification = "Verification",
  Recovery = "Recovery",
}
