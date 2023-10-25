import { Router } from "express";
import Authorize from "../middleware/authorize";
import StatisticsController from "../controllers/statistics.controller";
import asyncHandler from "../middleware/asyncHandler";

const statisticsRouter = Router();
const authorize = new Authorize();
const statisticsController = new StatisticsController();

statisticsRouter.get(
  "/",
  authorize.account,
  asyncHandler(statisticsController.statistics),
);

export default statisticsRouter;
