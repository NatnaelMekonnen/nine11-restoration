import { PaymentStatus } from "../constants/enums";
import {
  ConfirmPaymentDTO,
  MakePaymentDTO,
  RequestPaymentDTO,
} from "../dto/payment.dto";
import FileUploader from "../helpers/FileUploader";
import Transaction from "../models/Transaction";
import { IFulfilledPayment, IOrder, ITransaction } from "../models/interface";
import { AuthenticatedRequest, IServiceReturn } from "../types/type";
import CodeGenerator from "../helpers/CodeGenerator";
import { find, findOne } from "../helpers/Query";
import MailService from "../helpers/MailService";
import Order from "../models/Order";

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
    let amount: number;
    try {
      amount = parseFloat(params.amount);
      if (!amount || amount < 0) {
        throw new Error("Amount is invalid");
      }
    } catch (error) {
      return {
        success: false,
        status: 404,
        message: "Amount is invalid",
        data: error,
      };
    }

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
      amount,
      checkImage: upload.location,
      isConfirmed: false,
      paymentRef: this.codeGenerator.getPaymentRef(),
    };

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

    const totalFulfilled = updatedPayments?.reduce((sum, paid) => {
      if (!paid.amount) {
        return sum;
      }
      return sum + paid.amount;
    }, 0);

    let paymentStatus = payment.paymentStatus;

    if (payment.amount <= totalFulfilled) {
      paymentStatus = PaymentStatus.Successful;
    }

    const update = await Transaction.findByIdAndUpdate(
      params.paymentId,
      {
        $set: { fulfilledPayments: updatedPayments, paymentStatus },
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
    const order = (await Order.findOne({ payment: params.paymentId }).populate(
      "payment",
    )) as unknown as IOrder & { payment: ITransaction };

    if (!order) {
      return {
        success: false,
        status: 404,
        message: "Request not found!",
        data: order,
      };
    }

    if (order.payment?.from?.email) {
      await this.mailService.sendMail({
        subject: "Payment Requested",
        to: order.payment.from.email,
        text: `Hello, Payment has been requested for service.\nAmount: ${order?.cost}`,
      });
    }
    return {
      success: true,
      status: 200,
      message: "Payment requested!",
      data: order.payment,
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
      message: "Payment!",
      data: transactions,
    };
  }
}

export default PaymentService;
