import { Router } from "express";
import accountRouter from "./account.routes";
import requestRouter from "./request.routes";
import orderRouter from "./order.routes";
import paymentRouter from "./payment.routes";

const router = Router();

router.use("/account", accountRouter);
router.use("/request", requestRouter);
router.use("/order", orderRouter);
router.use("/payment", paymentRouter);

export default router;
