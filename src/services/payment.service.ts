import { PaymentStatus } from "../constants/enums";
import {
  ConfirmPaymentDTO,
  MakePaymentDTO,
  RequestPaymentDTO,
} from "../dto/payment.dto";
import FileUploader from "../helpers/FileUploader";
import Transaction from "../models/Transaction";
import { IFulfilledPayment, IOrder, IRequest } from "../models/interface";
import { AuthenticatedRequest, IServiceReturn } from "../types/type";
import CodeGenerator from "../helpers/CodeGenerator";
import { find, findOne } from "../helpers/Query";
import Request from "../models/Request";
import MailService from "../helpers/MailService";

class PaymentService {
  private fileUploader: FileUploader;
  private codeGenerator: CodeGenerator;
  private mailService: MailService;
  constructor() {
    this.fileUploader = new FileUploader();
    this.codeGenerator = new CodeGenerator();
    this.mailService = new MailService();
  }
  public async makePayment(params: MakePaymentDTO): Promise<IServiceReturn> {
    const payment = await Transaction.findById(params.paymentId);

    if (!payment) {
      return {
        success: false,
        status: 404,
        message: "Payment not found!",
        data: payment,
      };
    }

    const upload = await this.fileUploader.uploadFile(params.checkImage);
    if (!upload.success || !upload.location) {
      return {
        success: false,
        status: 500,
        message: "Check not saved, please try again!",
        data: upload,
      };
    }

    const paymentObject: IFulfilledPayment = {
      amount: params.amount,
      checkImage: upload.location,
      isConfirmed: false,
      paymentRef: this.codeGenerator.getPaymentRef(),
    };

    const totalFulfilled = payment.fulfilledPayments?.reduce((sum, paid) => {
      if (!paid.amount) {
        return 0;
      }
      return sum + paid.amount;
    }, 0);

    if (payment.amount <= totalFulfilled) {
      payment.paymentStatus = PaymentStatus.Successful;
    }

    payment.fulfilledPayments.push(paymentObject);

    await payment.save();

    return {
      success: true,
      status: 200,
      message: "Payment check uploaded",
      data: payment,
    };
  }
  public async confirmPayment(
    params: ConfirmPaymentDTO,
  ): Promise<IServiceReturn> {
    const payment = await Transaction.findById(params.paymentId).lean();
    if (!payment) {
      return {
        success: false,
        status: 404,
        message: "Payment not found!",
        data: payment,
      };
    }
    const updatedPayments = payment.fulfilledPayments.map((paid) => {
      if (paid.paymentRef === params.paymentRef) {
        return {
          ...paid,
          isConfirmed: true,
        };
      }
      return paid;
    });

    const update = await Transaction.findByIdAndUpdate(
      {
        $set: { fulfilledPayments: updatedPayments },
      },
      { new: true },
    );

    return {
      success: true,
      status: 200,
      message: "Payment check uploaded",
      data: update,
    };
  }
  public async requestPayment(
    params: RequestPaymentDTO,
  ): Promise<IServiceReturn> {
    const request = (await Request.findOne({ order: params.orderId }).populate(
      "order",
    )) as unknown as (IRequest & { order: IOrder }) | null;

    if (!request) {
      return {
        success: false,
        status: 404,
        message: "Request not found!",
        data: request,
      };
    }

    if (request.email) {
      await this.mailService.sendMail({
        subject: "Payment Requested",
        to: request.email,
        text: `Hello, Payment has been requested for service ${request.service}.\nAmount: ${request.order?.cost}`,
      });
    }
    return {
      success: true,
      status: 200,
      message: "Payment requested!",
      data: request,
    };
  }
  public async getPayments(req: AuthenticatedRequest): Promise<IServiceReturn> {
    const transactions = await find(Transaction, req, {});
    return {
      success: true,
      status: 200,
      message: "Payments",
      data: transactions,
    };
  }
  public async getPayment(req: AuthenticatedRequest): Promise<IServiceReturn> {
    const transactions = await findOne(Transaction, req, {
      _id: req.params.id,
    });
    return {
      success: true,
      status: 200,
      message: "Payments",
      data: transactions,
    };
  }
}

export default PaymentService;
