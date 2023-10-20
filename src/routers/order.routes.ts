import { NextFunction, Request, Response, Router } from "express";
import Authorize from "../middleware/authorize";
import asyncHandler from "../middleware/asyncHandler";
import { AccountType } from "../constants/enums";
import { expressValidate } from "../middleware/validate";
import { param } from "express-validator";
import OrderController from "../controllers/order.controller";
const orderRouter = Router();

const orderController = new OrderController();
const authorize = new Authorize();

orderRouter.get(
  "/",
  authorize.account,
  asyncHandler(orderController.getAllOrders),
);
orderRouter.get(
  "/:id",
  [param("id").notEmpty().isMongoId()],
  expressValidate,
  authorize.account,
  asyncHandler(orderController.getOrder),
);
orderRouter.post(
  "/",
  authorize.account,
  (req: Request, res: Response, next: NextFunction) =>
    authorize.allowedAccountTypes(req, res, next, [
      AccountType.Admin,
      AccountType.Staff,
    ]),
  asyncHandler(orderController.acceptOrder),
);
orderRouter.patch(
  "/:id",
  [param("id").notEmpty().isMongoId()],
  expressValidate,
  authorize.account,
  (req: Request, res: Response, next: NextFunction) =>
    authorize.allowedAccountTypes(req, res, next, [
      AccountType.Admin,
      AccountType.Staff,
    ]),
  asyncHandler(orderController.update),
);
orderRouter.patch(
  "/closeOrder/:id",
  [param("id").notEmpty().isMongoId()],
  expressValidate,
  authorize.account,
  (req: Request, res: Response, next: NextFunction) =>
    authorize.allowedAccountTypes(req, res, next, [
      AccountType.Admin,
      AccountType.Staff,
    ]),
  asyncHandler(orderController.closeOrder),
);
orderRouter.patch(
  "/completeOrder/:id",
  [param("id").notEmpty().isMongoId()],
  expressValidate,
  authorize.account,
  (req: Request, res: Response, next: NextFunction) =>
    authorize.allowedAccountTypes(req, res, next, [
      AccountType.Admin,
      AccountType.Staff,
    ]),
  asyncHandler(orderController.completeOrder),
);
orderRouter.delete(
  "/:id",
  [param("id").notEmpty().isMongoId()],
  expressValidate,
  authorize.account,
  (req: Request, res: Response, next: NextFunction) =>
    authorize.allowedAccountTypes(req, res, next, [
      AccountType.Admin,
      AccountType.Staff,
    ]),
  asyncHandler(orderController.deleteOrder),
);

export default orderRouter;
