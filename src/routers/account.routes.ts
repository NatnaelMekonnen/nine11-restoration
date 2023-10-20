import { NextFunction, Request, Response, Router } from "express";
import asyncHandler from "../middleware/asyncHandler";
import Authorize from "../middleware/authorize";
import AccountController from "../controllers/account.controller";
import { expressValidate } from "../middleware/validate";
import { param } from "express-validator";
import { AccountType } from "../constants/enums";

const authorize = new Authorize();
const accountController = new AccountController();
const accountRouter = Router();

accountRouter.post(
  "/create",
  authorize.optional,
  asyncHandler(accountController.createAccount),
);
accountRouter.post("/login", asyncHandler(accountController.login));
accountRouter.post(
  "/forgotPassword",
  asyncHandler(accountController.forgotPassword),
);
accountRouter.post(
  "/recoverPassword",
  asyncHandler(accountController.recoverPassword),
);
accountRouter.post(
  "/resendRecover",
  asyncHandler(accountController.resendRecoverOtp),
);
accountRouter.patch(
  "/",
  authorize.account,
  asyncHandler(accountController.updateOwnAccount),
);
accountRouter.patch(
  "/updatePassword",
  authorize.account,
  asyncHandler(accountController.updatePassword),
);
accountRouter.patch(
  "/:id",
  [param("id").notEmpty().isMongoId()],
  expressValidate,
  authorize.account,
  (req: Request, res: Response, next: NextFunction) =>
    authorize.allowedAccountTypes(req, res, next, [
      AccountType.Admin,
      AccountType.Staff,
    ]),
  asyncHandler(accountController.updateAccount),
);
accountRouter.patch(
  "/deactivate",
  expressValidate,
  authorize.account,
  asyncHandler(accountController.deactivateOwnAccount),
);
accountRouter.patch(
  "/activate/:id",
  [param("id").notEmpty().isMongoId()],
  expressValidate,
  authorize.account,
  (req: Request, res: Response, next: NextFunction) =>
    authorize.allowedAccountTypes(req, res, next, [AccountType.Admin]),
  asyncHandler(accountController.activateAccount),
);
accountRouter.patch(
  "/deactivate/:id",
  [param("id").notEmpty().isMongoId()],
  expressValidate,
  authorize.account,
  (req: Request, res: Response, next: NextFunction) =>
    authorize.allowedAccountTypes(req, res, next, [AccountType.Admin]),
  asyncHandler(accountController.deactivateAccount),
);
accountRouter.get(
  "/",
  authorize.account,
  (req: Request, res: Response, next: NextFunction) =>
    authorize.allowedAccountTypes(req, res, next, [
      AccountType.Admin,
      AccountType.Staff,
    ]),
  asyncHandler(accountController.getAllUsers),
);
accountRouter.get(
  "/profile",
  authorize.account,
  asyncHandler(accountController.profile),
);
accountRouter.get(
  "/:id",
  authorize.account,
  (req: Request, res: Response, next: NextFunction) =>
    authorize.allowedAccountTypes(req, res, next, [
      AccountType.Admin,
      AccountType.Staff,
    ]),
  asyncHandler(accountController.getUser),
);

export default accountRouter;
