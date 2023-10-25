import { Router } from "express";
import Authorize from "../middleware/authorize";
import asyncHandler from "../middleware/asyncHandler";
import { expressValidate } from "../middleware/validate";
import { param } from "express-validator";
import StaffController from "../controllers/staff.controller";
const staffRouter = Router();

const requestController = new StaffController();
const authorize = new Authorize();

staffRouter.get(
  "/",
  authorize.account,
  asyncHandler(requestController.getAllStaff),
);
staffRouter.get(
  "/:id",
  [param("id").notEmpty().isMongoId()],
  expressValidate,
  authorize.account,
  asyncHandler(requestController.getStaff),
);
staffRouter.post(
  "/",
  authorize.optional,
  asyncHandler(requestController.createStaff),
);
staffRouter.patch(
  "/:id",
  [param("id").notEmpty().isMongoId()],
  expressValidate,
  authorize.account,
  asyncHandler(requestController.updateStaff),
);
staffRouter.patch(
  "/activate/:id",
  [param("id").notEmpty().isMongoId()],
  expressValidate,
  authorize.account,
  asyncHandler(requestController.activateStaff),
);
staffRouter.patch(
  "/deactivate/:id",
  [param("id").notEmpty().isMongoId()],
  expressValidate,
  authorize.account,
  asyncHandler(requestController.deactivateStaff),
);
staffRouter.patch(
  "/suspend/:id",
  [param("id").notEmpty().isMongoId()],
  expressValidate,
  authorize.account,
  asyncHandler(requestController.suspendStaff),
);
staffRouter.delete(
  "/:id",
  [param("id").notEmpty().isMongoId()],
  expressValidate,
  authorize.account,
  asyncHandler(requestController.deleteStaff),
);

export default staffRouter;
