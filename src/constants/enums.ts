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
  Canceled = "Canceled",
}
export enum OrderStatus {
  Pending = "Pending",
  Completed = "Completed",
  Canceled = "Canceled",
}
export enum PaymentStatus {
  Pending = "Pending",
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
