import { Response } from "express";
import {
  AuthenticatedRequest,
  OptionalAuthenticatedRequest,
} from "../types/type";
import ResponseHandler from "../middleware/response";
import { validateRequest } from "../middleware/validate";
import { ConfirmPaymentDTO, MakePaymentDTO } from "../dto/payment.dto";
import PaymentService from "../services/payment.service";

const response = new ResponseHandler();
const paymentService = new PaymentService();

class PaymentController {
  public async makePayment(req: OptionalAuthenticatedRequest, res: Response) {
    const makePaymentDTO = await validateRequest(MakePaymentDTO, req.body);

    if (makePaymentDTO.error || !makePaymentDTO.data) {
      return response.send(res, 400, {
        data: makePaymentDTO.error,
      });
    }

    const resp = await paymentService.makePayment(makePaymentDTO.data);

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async confirmPayment(req: AuthenticatedRequest, res: Response) {
    const confirmPaymentDTO = await validateRequest(
      ConfirmPaymentDTO,
      req.body,
    );

    if (confirmPaymentDTO.error || !confirmPaymentDTO.data) {
      return response.send(res, 400, {
        data: confirmPaymentDTO.error,
      });
    }

    const resp = await paymentService.confirmPayment(confirmPaymentDTO.data);

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async getAllPayments(req: AuthenticatedRequest, res: Response) {
    const resp = await paymentService.getPayments(req);

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async getPayment(req: AuthenticatedRequest, res: Response) {
    const resp = await paymentService.getPayment(req);

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
}

export default PaymentController;
