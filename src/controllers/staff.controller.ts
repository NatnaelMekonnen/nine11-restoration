import { Response } from "express";
import { CreateStaffDTO, UpdateStaffDTO } from "../dto/staff.dto";
import ResponseHandler from "../middleware/response";
import { validateRequest } from "../middleware/validate";
import { AuthenticatedRequest } from "../types/type";
import StaffService from "../services/staff.service";
import { AccountStatus } from "../constants/enums";

const response = new ResponseHandler();
const staffService = new StaffService();

class StaffController {
  public async createStaff(req: AuthenticatedRequest, res: Response) {
    const createDTO = await validateRequest(CreateStaffDTO, req.body);

    if (createDTO.error || !createDTO.data) {
      return response.send(res, 400, {
        data: createDTO.error,
      });
    }

    const resp = await staffService.createStaff(createDTO.data, req.account);

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async updateStaff(req: AuthenticatedRequest, res: Response) {
    const updateDTO = await validateRequest(UpdateStaffDTO, req.body);

    if (updateDTO.error || !updateDTO.data) {
      return response.send(res, 400, {
        data: updateDTO.error,
      });
    }

    const resp = await staffService.updateStaff(
      req.params.id,
      updateDTO.data,
      req.account,
    );

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async activateStaff(req: AuthenticatedRequest, res: Response) {
    const resp = await staffService.changeStaffStatus(
      req.params.id,
      AccountStatus.Active,
      req.account,
    );

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async deactivateStaff(req: AuthenticatedRequest, res: Response) {
    const resp = await staffService.changeStaffStatus(
      req.params.id,
      AccountStatus.Inactive,
      req.account,
    );

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async suspendStaff(req: AuthenticatedRequest, res: Response) {
    const resp = await staffService.changeStaffStatus(
      req.params.id,
      AccountStatus.Suspended,
      req.account,
    );

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async deleteStaff(req: AuthenticatedRequest, res: Response) {
    const resp = await staffService.deleteStaff(req.params.id);

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async getAllStaff(req: AuthenticatedRequest, res: Response) {
    const resp = await staffService.getAllStaff(req);

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async getStaff(req: AuthenticatedRequest, res: Response) {
    const resp = await staffService.getStaff(req);

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
}

export default StaffController;
