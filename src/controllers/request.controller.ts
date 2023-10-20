import { Response } from "express";
import {
  AuthenticatedRequest,
  OptionalAuthenticatedRequest,
} from "../types/type";
import ResponseHandler from "../middleware/response";
import RequestService from "../services/request.service";
import { validateRequest } from "../middleware/validate";
import { CreateRequestDTO, UpdateRequestDTO } from "../dto/request.dto";
import { RequestStatus } from "../constants/enums";

const response = new ResponseHandler();
const requestService = new RequestService();

class RequestController {
  public async createRequest(req: OptionalAuthenticatedRequest, res: Response) {
    const createDTO = await validateRequest(CreateRequestDTO, req.body);

    if (createDTO.error || !createDTO.data) {
      return response.send(res, 400, {
        data: createDTO.error,
      });
    }

    const resp = await requestService.createRequest(
      createDTO.data,
      req.account,
    );

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async UpdateRequest(req: AuthenticatedRequest, res: Response) {
    const updateDTO = await validateRequest(UpdateRequestDTO, req.body);

    if (updateDTO.error || !updateDTO.data) {
      return response.send(res, 400, {
        data: updateDTO.error,
      });
    }

    const resp = await requestService.updateRequest(
      req.params.id,
      updateDTO.data,
      req.account,
    );

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async closeRequest(req: AuthenticatedRequest, res: Response) {
    const resp = await requestService.changeRequestStatus(
      req.params.id,
      RequestStatus.Closed,
      req.account,
    );

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async deleteRequest(req: AuthenticatedRequest, res: Response) {
    const resp = await requestService.deleteRequest(req.params.id);

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async getAllRequests(req: AuthenticatedRequest, res: Response) {
    const resp = await requestService.getAllRequest(req, req.account);

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async getRequest(req: AuthenticatedRequest, res: Response) {
    const resp = await requestService.getRequest(req);

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
}

export default RequestController;
