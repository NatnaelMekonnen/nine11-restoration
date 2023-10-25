import { Types } from "mongoose";
import { AccountStatus, AccountType } from "../constants/enums";
import { AuthenticatedRequest, IServiceReturn } from "../types/type";
import { IAccount } from "../models/interface";
import { find, findOne } from "../helpers/Query";
import { CreateStaffDTO, UpdateStaffDTO } from "../dto/staff.dto";
import Staff from "../models/Staff";

class StaffService {
  public async createStaff(
    params: CreateStaffDTO,
    account?: IAccount,
  ): Promise<IServiceReturn> {
    const staff = new Staff({
      ...params,
      account: account?._id,
      staffStatus: AccountStatus.Active,
    });

    if (!staff) {
      return {
        success: false,
        status: 400,
        message: "Error in staff creation",
        data: staff,
      };
    }

    await staff.save();

    return {
      success: true,
      status: 200,
      message: "Staff Added",
      data: staff,
    };
  }
  public async updateStaff(
    id: string | Types.ObjectId,
    params: UpdateStaffDTO,
    account: IAccount,
  ): Promise<IServiceReturn> {
    const staff = await Staff.findById(id);

    if (!staff) {
      return {
        success: false,
        status: 400,
        message: "Error in staff creation",
        data: staff,
      };
    }

    if (
      account.accountType !== AccountType.Admin &&
      account.accountType !== AccountType.Staff
    ) {
      if (staff) {
        return {
          success: false,
          status: 403,
          message: "Not Authorized to perform this task!",
          data: null,
        };
      }
    }

    const updated = await Staff.findOneAndUpdate({ _id: staff._id }, params, {
      new: true,
    });

    return {
      success: true,
      status: 200,
      message: "Staff updated",
      data: updated,
    };
  }
  public async changeStaffStatus(
    id: string | Types.ObjectId,
    status: keyof typeof AccountStatus,
    account: IAccount,
  ): Promise<IServiceReturn> {
    const staff = await Staff.findOne({
      account: account._id,
      _id: id,
    });

    if (!staff) {
      return {
        success: false,
        status: 404,
        message: "Staff not found",
        data: staff,
      };
    }

    staff.staffStatus = status;

    await staff.save();

    return {
      success: true,
      status: 200,
      message: `Staff status changed to ${status}`,
      data: staff,
    };
  }
  public async deleteStaff(id: string): Promise<IServiceReturn> {
    const staff = await Staff.findById(id);

    await staff?.deleteOne();

    return {
      success: true,
      status: 200,
      message: `Staff deleted!`,
      data: staff,
    };
  }
  public async getAllStaff(req: AuthenticatedRequest) {
    const staff = await find(Staff, req);

    return {
      success: true,
      status: 200,
      message: `Staff`,
      data: staff,
    };
  }
  public async getStaff(req: AuthenticatedRequest) {
    const id = req.params.id;
    const staff = await findOne(Staff, req, {
      _id: id,
    });

    return {
      success: true,
      status: 200,
      message: `Staff`,
      data: staff,
    };
  }
}

export default StaffService;
