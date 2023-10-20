import { PaymentStatus } from "../constants/enums";
import { ConfirmPaymentDTO, MakePaymentDTO } from "../dto/payment.dto";
import FileUploader from "../helpers/FileUploader";
import Transaction from "../models/Transaction";
import { IFulfilledPayment } from "../models/interface";
import { AuthenticatedRequest, IServiceReturn } from "../types/type";
import CodeGenerator from "../helpers/CodeGenerator";
import { find, findOne } from "../helpers/Query";

class PaymentService {
  private fileUploader: FileUploader;
  private codeGenerator: CodeGenerator;
  constructor() {
    this.fileUploader = new FileUploader();
    this.codeGenerator = new CodeGenerator();
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
  public async getPayments(req: AuthenticatedRequest): Promise<IServiceReturn> {
    const transactions = await find(Transaction, req, {});
    return {
      success: true,
      status: 200,
      message: "Payments",
      data: transactions,
    };
  }
  public async getPayment(
    id: string,
    req: AuthenticatedRequest,
  ): Promise<IServiceReturn> {
    const transactions = await findOne(Transaction, req, { _id: id });
    return {
      success: true,
      status: 200,
      message: "Payments",
      data: transactions,
    };
  }
}

export default PaymentService;
