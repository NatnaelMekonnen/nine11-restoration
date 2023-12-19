import moment from "moment";
import {
  CreateAccountDTO,
  UpdateAccountDTO,
  UpdatePasswordDTO,
} from "../dto/account.dto";
import CodeGenerator from "../helpers/CodeGenerator";
import MailService from "../helpers/MailService";
import PasswordManager from "../helpers/PasswordManager";
import { find, findOne } from "../helpers/Query";
import TokenManager from "../helpers/TokenManager";
import Account from "../models/Account";
import Otp from "../models/Otp";
import { generateOTP } from "../utils/generateOTP";
import { ClientSession, Document, Types } from "mongoose";
import { Request } from "express";
import { AccountStatus, AccountType, OtpType } from "../constants/enums";
import { IAccount } from "../models/interface";
import { AuthenticatedRequest, IServiceReturn } from "../types/type";
import { validateRequest } from "../middleware/validate";
import { CreateStaffDTO } from "../dto/staff.dto";
import Staff from "../models/Staff";
import { withTransaction } from "../utils/withTransaction";

class AccountService {
  private codeGenerator: CodeGenerator;
  private mailService: MailService;
  private passwordManager: PasswordManager;
  private tokenManager: TokenManager;

  constructor() {
    this.codeGenerator = new CodeGenerator();
    this.mailService = new MailService();
    this.passwordManager = new PasswordManager(10);
    this.tokenManager = new TokenManager();
  }

  public async createAccount(
    params: CreateAccountDTO,
    account?: IAccount,
  ): Promise<IServiceReturn> {
    try {
      const isEmailUsed = await Account.findOne({ email: params.email });
      if (isEmailUsed) {
        return {
          message: "Email has already been used",
          data: {},
          status: 400,
          success: false,
        };
      }
      if (account?.accountType === AccountType.Admin && !params.password) {
        params.password = this.codeGenerator.getTemporaryPassword();
      }
      let staff: Document | undefined = undefined;
      const newAccount = new Account({
        firstName: params.firstName,
        lastName: params.lastName,
        accountType: params.accountType,
        phone: params.phone,
        password: params.password,
        email: params.email,
      });

      if (params.accountType === AccountType.Staff) {
        const staffCreate = await validateRequest(CreateStaffDTO, {
          staff: String(newAccount._id),
          role: params.role,
        });

        if (staffCreate.error || !staffCreate.data) {
          return {
            success: false,
            status: 400,
            message: "Error in staff creation",
            data: staffCreate.error,
          };
        }
        staff = new Staff({
          ...params,
          account: newAccount?._id,
          staffStatus: AccountStatus.Active,
        });
      }

      await withTransaction(async (session: ClientSession) => {
        await newAccount.save({ session });
        if (staff) {
          await staff.save({ session });
        }
      });
      if (account?.accountType === AccountType.Admin) {
        this.mailService.sendMail({
          subject: "Account Created",
          text: `Hello, An account has been created by this email, please use the following temporary password to login ${params.password} `,
          to: params.email,
        });
      }

      return {
        success: Boolean(newAccount),
        status: 200,
        message: "Account Created Successfully!",
        data: newAccount,
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        message: "Error occurred in account creation",
        data: error,
      };
    }
  }
  public async updateAccount(
    params: UpdateAccountDTO,
    id?: string | Types.ObjectId,
  ): Promise<IServiceReturn> {
    try {
      const account = await Account.findById(id);

      if (!account) {
        return {
          success: false,
          status: 404,
          message: "Account not found!",
          data: account,
        };
      }
      const updated = await Account.findOneAndUpdate(
        { _id: account._id },
        params,
        { new: true },
      );

      return {
        success: true,
        status: 200,
        message: "Account updated successfully!",
        data: updated,
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        message: "Error in account update!",
        data: error,
      };
    }
  }
  public async updatePassword(
    params: UpdatePasswordDTO,
    account: IAccount,
  ): Promise<IServiceReturn> {
    try {
      const updateAccount = await Account.findById(account._id);

      if (!updateAccount) {
        return {
          success: false,
          status: 404,
          message: "Account not found",
          data: updateAccount,
        };
      }

      if (updateAccount?.password) {
        const validPass = await this.passwordManager.verifyPassword(
          params.oldPassword,
          updateAccount.password,
        );

        if (!validPass) {
          return {
            success: false,
            status: 400,
            data: null,
            message: "Wrong password!",
          };
        }
      }

      updateAccount.password = params.newPassword;
      await updateAccount.save();

      return {
        success: true,
        status: 200,
        message: "Account password updated",
        data: updateAccount,
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        message: "Error in password update!",
        data: error,
      };
    }
  }
  public async login(
    {
      email,
      phone,
      password,
    }: {
      email: string;
      phone: string;
      password: string;
    },
    req: Request,
  ): Promise<IServiceReturn> {
    try {
      let account: IAccount | null;
      if (email) {
        account = await findOne(Account, req, { email });
      } else {
        account = await findOne(Account, req, {
          phone,
        });
      }

      if (!account) {
        return {
          success: false,
          status: 401,
          message: "Invalid Credentials",
          data: account,
        };
      }
      if (account.accountStatus !== AccountStatus.Active) {
        return {
          success: false,
          status: 403,
          message: `Account not active, current account status is ${account.accountStatus}`,
          data: account,
        };
      }
      if (!account.password) {
        return {
          success: false,
          status: 400,
          message: "No password, update password",
          data: account,
        };
      }

      const validPass = await this.passwordManager.verifyPassword(
        password,
        account.password,
      );

      if (!validPass) {
        return {
          success: false,
          status: 401,
          message: "Invalid Credentials",
          data: account,
        };
      }

      const token = this.tokenManager.generateToken(account);

      return {
        success: true,
        status: 200,
        message: "Welcome!!",
        data: {
          token,
          account,
        },
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        message: "Error on login",
        data: error,
      };
    }
  }
  public async resendRecoverOTP({
    email,
    phone,
  }: {
    email?: string;
    phone?: string;
  }): Promise<IServiceReturn> {
    try {
      let account: IAccount | null;
      if (email) {
        account = await Account.findOne({
          email,
        });
      } else {
        account = await Account.findOne({
          phone,
        });
      }

      if (!account) {
        return {
          success: false,
          status: 404,
          message: "Account not found",
          data: account,
        };
      }
      if (account.accountStatus !== AccountStatus.Active) {
        return {
          success: false,
          status: 403,
          message: `Account not active, current account status is ${account.accountStatus}`,
          data: account,
        };
      }
      const otp = generateOTP();
      await Otp.create({
        account: account._id,
        otp,
        type: OtpType.Recovery,
      });

      this.mailService.sendMail({
        to: account.email,
        subject: "Recover Password",
        text: `Please use this code to confirm and reset password\n\n${otp}`,
      });

      return {
        success: true,
        status: 200,
        data: account,
        message: "Password recovery instructions have been sent",
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        message: "Error on password recovery",
        data: error,
      };
    }
  }
  public async forgotPassword({
    email,
    phone,
  }: {
    email?: string;
    phone?: string;
  }): Promise<IServiceReturn> {
    try {
      let account: IAccount | null;
      if (email) {
        account = await Account.findOne({
          email,
        });
      } else {
        account = await Account.findOne({
          phone,
        });
      }

      if (!account) {
        return {
          success: false,
          status: 404,
          message: "Account not found",
          data: account,
        };
      }

      const otp = generateOTP();
      await Otp.create({
        account: account._id,
        otp,
        type: OtpType.Recovery,
      });

      this.mailService.sendMail({
        to: account.email,
        subject: "Recover Password",
        text: `Please use this code to confirm and reset password\n\n${otp}`,
      });

      return {
        success: true,
        status: 200,
        data: account,
        message: "Password recovery instructions have been sent",
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        message: "Error on password recovery",
        data: error,
      };
    }
  }
  public async recoverPassword({
    otp,
    password,
  }: {
    otp: string;
    password: string;
  }): Promise<IServiceReturn> {
    try {
      const accountOtp = await Otp.findOne({
        otp,
        type: OtpType.Recovery,
        expired: false,
      });

      if (!accountOtp) {
        return {
          success: false,
          status: 400,
          message: "Invalid OTP",
          data: accountOtp,
        };
      }

      if (
        accountOtp.expired ||
        (accountOtp.expires_at &&
          moment(accountOtp.expires_at).isBefore(moment()))
      ) {
        accountOtp.expired = true;
        await accountOtp.save();
        return {
          success: false,
          status: 400,
          message: "OTP Expired",
          data: accountOtp,
        };
      }
      const account = await Account.findById(accountOtp.account);

      if (!account) {
        return {
          success: false,
          status: 404,
          message: "Account not found",
          data: account,
        };
      }

      account.password = password;
      await account.save();

      accountOtp.expired = true;
      await accountOtp.save();

      const token = this.tokenManager.generateToken(account);
      return {
        success: true,
        status: 200,
        message: "Password recovered",
        data: {
          account,
          token,
        },
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        message: "Error on password recovery",
        data: error,
      };
    }
  }
  public async changeStatus(
    id: string | Types.ObjectId,
    status: keyof typeof AccountStatus,
  ): Promise<IServiceReturn> {
    const account = await Account.findById(id);

    if (!account) {
      return {
        success: false,
        status: 404,
        message: "Account not found",
        data: account,
      };
    }

    account.accountStatus = status;
    await account.save();

    return {
      success: true,
      status: 200,
      message: `Account Status changed to ${status}`,
      data: account,
    };
  }
  public async getAllUsers(req: AuthenticatedRequest): Promise<IServiceReturn> {
    const users = await find(Account, req, {});

    return {
      success: true,
      status: 200,
      data: users,
      message: "Users Fetched!",
    };
  }
  public async getUser(
    id: string | Types.ObjectId,
    req: Request,
  ): Promise<IServiceReturn> {
    const account = await findOne(Account, req, { _id: id });

    return {
      success: true,
      message: "Account!",
      status: 200,
      data: account,
    };
  }
}

export default AccountService;
