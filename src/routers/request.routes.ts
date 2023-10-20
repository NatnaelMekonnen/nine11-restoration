import { Router } from "express";
import Authorize from "../middleware/authorize";
import RequestController from "../controllers/request.controller";
import asyncHandler from "../middleware/asyncHandler";
import { expressValidate } from "../middleware/validate";
import { param } from "express-validator";
const requestRouter = Router();

const requestController = new RequestController();
const authorize = new Authorize();

requestRouter.get(
  "/",
  authorize.account,
  asyncHandler(requestController.getAllRequests),
);
requestRouter.get(
  "/:id",
  [param("id").notEmpty().isMongoId()],
  expressValidate,
  authorize.account,
  asyncHandler(requestController.getRequest),
);
requestRouter.post(
  "/",
  authorize.optional,
  asyncHandler(requestController.createRequest),
);
requestRouter.patch(
  "/:id",
  [param("id").notEmpty().isMongoId()],
  expressValidate,
  authorize.account,
  asyncHandler(requestController.updateRequest),
);
requestRouter.patch(
  "/closeRequest/:id",
  [param("id").notEmpty().isMongoId()],
  expressValidate,
  authorize.account,
  asyncHandler(requestController.closeRequest),
);
requestRouter.delete(
  "/:id",
  [param("id").notEmpty().isMongoId()],
  expressValidate,
  authorize.account,
  asyncHandler(requestController.deleteRequest),
);

export default requestRouter;
