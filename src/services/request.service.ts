import { ClientSession, Types } from "mongoose";
import { AccountType, RequestStatus } from "../constants/enums";
import { CreateRequestDTO, UpdateRequestDTO } from "../dto/request.dto";
import Request from "../models/Request";
import { AuthenticatedRequest, IServiceReturn } from "../types/type";
import { IAccount } from "../models/interface";
import { find, findOne } from "../helpers/Query";
import Order from "../models/Order";
import { withTransaction } from "../utils/withTransaction";

class RequestService {
  public async createRequest(
    params: CreateRequestDTO,
    account?: IAccount,
  ): Promise<IServiceReturn> {
    const request = new Request({
      ...params,
      requestStatus: RequestStatus.Pending,
      createdBy: account?._id,
    });

    if (!request) {
      return {
        success: false,
        status: 400,
        message: "Error in request creation",
        data: request,
      };
    }

    await request.save();

    return {
      success: true,
      status: 200,
      message: "Request created",
      data: request,
    };
  }
  public async updateRequest(
    id: string | Types.ObjectId,
    params: UpdateRequestDTO,
    account: IAccount,
  ): Promise<IServiceReturn> {
    const request = await Request.findById(id);

    if (!request) {
      return {
        success: false,
        status: 400,
        message: "Error in request creation",
        data: request,
      };
    }

    if (
      account.accountType !== AccountType.Admin &&
      account.accountType !== AccountType.Staff &&
      request.createdBy !== account._id
    ) {
      if (request) {
        return {
          success: false,
          status: 403,
          message: "Not Authorized to perform this task!",
          data: null,
        };
      }
    }

    const updated = await Request.findOneAndUpdate(
      { _id: request._id },
      params,
      {
        new: true,
      },
    );

    return {
      success: true,
      status: 200,
      message: "Request created",
      data: updated,
    };
  }
  public async changeRequestStatus(
    id: string | Types.ObjectId,
    status: keyof typeof RequestStatus,
    account: IAccount,
  ): Promise<IServiceReturn> {
    const request = await Request.findById(id);

    if (!request) {
      return {
        success: false,
        status: 400,
        message: "Error in request creation",
        data: request,
      };
    }

    request.requestStatus = status;
    if (status === RequestStatus.Closed) {
      request.closedBy = account._id;
    }

    await request.save();

    return {
      success: true,
      status: 200,
      message: `Request status changed to ${status}`,
      data: request,
    };
  }
  public async deleteRequest(id: string): Promise<IServiceReturn> {
    const request = await Request.findById(id);
    const order = await Order.findById(request?.order);

    await withTransaction(async (session: ClientSession) => {
      await request?.deleteOne({ session });
      await order?.deleteOne({ session });
    });

    return {
      success: true,
      status: 200,
      message: `Request deleted!`,
      data: request,
    };
  }
  public async getAllRequest(req: AuthenticatedRequest, account: IAccount) {
    const id =
      account?.accountType !== AccountType.Admin &&
      account?.accountType !== AccountType.Staff
        ? account?._id
        : undefined;

    const conditions = id ? { createdBy: id } : {};
    const requests = await find(Request, req, conditions);

    return {
      success: true,
      status: 200,
      message: `Requests`,
      data: requests,
    };
  }
  public async getRequest(req: AuthenticatedRequest, account?: IAccount) {
    const accountId =
      account?.accountType !== AccountType.Admin &&
      account?.accountType !== AccountType.Staff
        ? account?._id
        : undefined;
    const id = req.params.id;

    const conditions = accountId ? { createdBy: accountId, _id: id } : {};
    const requests = await findOne(Request, req, conditions);

    return {
      success: true,
      status: 200,
      message: `Request`,
      data: requests,
    };
  }
}

export default RequestService;
