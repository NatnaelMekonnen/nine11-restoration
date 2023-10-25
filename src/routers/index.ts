import { Router } from "express";
import accountRouter from "./account.routes";
import requestRouter from "./request.routes";
import orderRouter from "./order.routes";
import paymentRouter from "./payment.routes";
import statisticsRouter from "./statistics.routes";
import staffRouter from "./staff.routes";

const router = Router();

router.use("/account", accountRouter);
router.use("/staff", staffRouter);
router.use("/request", requestRouter);
router.use("/order", orderRouter);
router.use("/payment", paymentRouter);
router.use("/statistics", statisticsRouter);

export default router;
