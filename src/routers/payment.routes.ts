import { NextFunction, Request, Response, Router } from "express";
import PaymentController from "../controllers/payment.controller";
import Authorize from "../middleware/authorize";
import asyncHandler from "../middleware/asyncHandler";
import { param } from "express-validator";
import { expressValidate } from "../middleware/validate";
import { AccountType } from "../constants/enums";

const paymentRouter = Router();
const paymentController = new PaymentController();
const authorize = new Authorize();

paymentRouter.get(
  "/",
  authorize.account,
  asyncHandler(paymentController.getAllPayments),
);
paymentRouter.get(
  "/:id",
  [param("id").notEmpty().isMongoId()],
  expressValidate,
  authorize.account,
  asyncHandler(paymentController.getPayment),
);
paymentRouter.post(
  "/",
  authorize.optional,
  asyncHandler(paymentController.makePayment),
);
paymentRouter.post(
  "/request",
  authorize.account,
  (req: Request, res: Response, next: NextFunction) =>
    authorize.allowedAccountTypes(req, res, next, [
      AccountType.Admin,
      AccountType.Staff,
    ]),
  asyncHandler(paymentController.requestPayment),
);
paymentRouter.patch(
  "/confirm",
  authorize.account,
  (req: Request, res: Response, next: NextFunction) =>
    authorize.allowedAccountTypes(req, res, next, [
      AccountType.Admin,
      AccountType.Staff,
    ]),
  asyncHandler(paymentController.confirmPayment),
);

export default paymentRouter;
