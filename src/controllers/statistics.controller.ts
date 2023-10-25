import { Response } from "express";
import { AuthenticatedRequest } from "../types/type";
import ResponseHandler from "../middleware/response";
import StatisticsService from "../services/statistics.service";

const response = new ResponseHandler();
const statisticsService = new StatisticsService();

class StatisticsController {
  public async statistics(req: AuthenticatedRequest, res: Response) {
    const resp = await statisticsService.summary();

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
}

export default StatisticsController;
