import { Request, Response } from "express";
import AccountService from "../services/account.service";
import ResponseHandler from "../middleware/response";
import {
  CreateAccountDTO,
  UpdateAccountDTO,
  UpdatePasswordDTO,
} from "../dto/account.dto";
import { validateRequest } from "../middleware/validate";
import { Types } from "mongoose";
import { AccountStatus } from "../constants/enums";
import { AuthenticatedRequest, OptionalAuthenticatedRequest } from "../types/type";

const accountService = new AccountService();
const response = new ResponseHandler();

class AccountController {
  public async createAccount(req: OptionalAuthenticatedRequest, res: Response) {
    const accountCreate = await validateRequest(CreateAccountDTO, req.body);

    if (accountCreate.error || !accountCreate.data) {
      return response.send(res, 400, {
        data: accountCreate.error,
      });
    }

    const resp = await accountService.createAccount(
      accountCreate.data,
      req.account,
    );

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async updateOwnAccount(req: AuthenticatedRequest, res: Response) {
    const accountUpdate = await validateRequest(UpdateAccountDTO, req.body);

    if (accountUpdate.error || !accountUpdate.data) {
      return response.send(res, 400, {
        data: accountUpdate.error,
      });
    }

    const resp = await accountService.updateAccount(
      accountUpdate.data,
      req.account?._id,
    );

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async updateAccount(req: AuthenticatedRequest, res: Response) {
    const accountUpdate = await validateRequest(UpdateAccountDTO, req.body);

    if (accountUpdate.error || !accountUpdate.data) {
      return response.send(res, 400, {
        data: accountUpdate.error,
      });
    }

    const resp = await accountService.updateAccount(
      accountUpdate.data,
      req.params.id,
    );

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async updatePassword(req: AuthenticatedRequest, res: Response) {
    const passwordUpdate = await validateRequest(UpdatePasswordDTO, req.body);

    if (passwordUpdate.error || !passwordUpdate.data) {
      return response.send(res, 400, {
        data: passwordUpdate.error,
      });
    }

    const resp = await accountService.updatePassword(
      passwordUpdate.data,
      req.account,
    );

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async forgotPassword(req: Request, res: Response) {
    const resp = await accountService.forgotPassword(req.body);

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async resendRecoverOtp(req: Request, res: Response) {
    const resp = await accountService.resendRecoverOTP(req.body);

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async recoverPassword(req: Request, res: Response) {
    const resp = await accountService.recoverPassword(req.body);

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async login(req: Request, res: Response) {
    const resp = await accountService.login(req.body, req);

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async deactivateOwnAccount(req: AuthenticatedRequest, res: Response) {
    const accountId: Types.ObjectId | string = req.account._id;

    const resp = await accountService.changeStatus(
      accountId,
      AccountStatus.Inactive,
    );

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async activateOwnAccount(req: AuthenticatedRequest, res: Response) {
    const accountId: Types.ObjectId | string = req.account._id;

    const resp = await accountService.changeStatus(
      accountId,
      AccountStatus.Active,
    );

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async deactivateAccount(req: AuthenticatedRequest, res: Response) {
    const resp = await accountService.changeStatus(
      req.params.id,
      AccountStatus.Inactive,
    );

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async activateAccount(req: AuthenticatedRequest, res: Response) {
    const resp = await accountService.changeStatus(
      req.params.id,
      AccountStatus.Active,
    );

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async getAllUsers(req: AuthenticatedRequest, res: Response) {
    const resp = await accountService.getAllUsers(req);

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async getUser(req: AuthenticatedRequest, res: Response) {
    const resp = await accountService.getUser(req.params.id, req);

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async profile(req: AuthenticatedRequest, res: Response) {
    const resp = await accountService.getUser(req.account._id, req);

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
}

export default AccountController;
