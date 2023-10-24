import { ClientSession, Types } from "mongoose";
import {
  AccountType,
  OrderStatus,
  PaymentReason,
  PaymentStatus,
  RequestStatus,
} from "../constants/enums";
import Order from "../models/Order";
import { AuthenticatedRequest, IServiceReturn } from "../types/type";
import { IAccount, IOrder } from "../models/interface";
import { find, findOne } from "../helpers/Query";
import moment from "moment";
import { CreateOrderDTO, UpdateOrderDTO } from "../dto/order.dto";
import CodeGenerator from "../helpers/CodeGenerator";
import { withTransaction } from "../utils/withTransaction";
import Transaction from "../models/Transaction";
import Request from "../models/Request";
import { filterUndefined } from "../utils/sanitize";

class OrderService {
  private codeGenerator: CodeGenerator;

  constructor() {
    this.codeGenerator = new CodeGenerator();
  }

  public async createOrder(params: CreateOrderDTO): Promise<IServiceReturn> {
    try {
      const request = await Request.findById(params.requestId);

      if (!request) {
        return {
          success: false,
          status: 400,
          message: "Request not found!",
          data: request,
        };
      }

      const payment = new Transaction({
        amount: params.cost,
        from: {
          fullName: request.fullName,
          email: request.email,
          phone: request.phoneNumber,
        },
        paymentStatus: PaymentStatus.Pending,
        reason: PaymentReason.ServiceProvided,
      });

      const order = new Order({
        acceptedDate: moment().toISOString(),
        cost: params.cost,
        orderId: await this.codeGenerator.getOrderId(),
        orderStatus: OrderStatus.Pending,
      });

      order.payment = payment._id;
      order.request = request._id;

      request.requestStatus = RequestStatus.Accepted;
      request.order = order._id;

      await withTransaction(async (session: ClientSession) => {
        await payment.save({ session });
        await order.save({ session });
        await request.save({ session });
      });

      return {
        success: true,
        status: 200,
        message: "Order created",
        data: order,
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        message: "Error in order creation!",
        data: error,
      };
    }
  }
  public async updateOrder(
    id: string | Types.ObjectId,
    params: UpdateOrderDTO,
  ): Promise<IServiceReturn> {
    const order = await Order.findById(id);

    if (!order) {
      return {
        success: false,
        status: 400,
        message: "Bad request!",
        data: order,
      };
    }

    const updated = await Order.findOneAndUpdate(
      { _id: order._id },
      {
        cost: params.cost,
        assignedAgent: params.assignedAgent,
      },
      { new: true },
    );

    if (updated) {
      await Transaction.findOneAndUpdate(
        {
          _id: updated.payment,
        },
        { amount: params.cost },
      );
    }

    return {
      success: true,
      status: 200,
      message: "Order created",
      data: updated,
    };
  }
  public async changeOrderStatus(
    id: string | Types.ObjectId,
    status: keyof typeof OrderStatus,
  ): Promise<IServiceReturn> {
    const order = await Order.findById(id);

    if (!order) {
      return {
        success: false,
        status: 400,
        message: "Bad request!",
        data: order,
      };
    }

    order.orderStatus = status;
    await order.save();

    return {
      success: true,
      status: 200,
      message: `Order status changed to ${status}`,
      data: order,
    };
  }
  public async deleteOrder(id: string): Promise<IServiceReturn> {
    const request = await Order.findByIdAndDelete(id);

    return {
      success: true,
      status: 200,
      message: `Order deleted!`,
      data: request,
    };
  }
  public async getAllOrder(req: AuthenticatedRequest, account: IAccount) {
    const id =
      account?.accountType !== AccountType.Admin &&
      account?.accountType !== AccountType.Staff
        ? account?._id
        : undefined;

    let ids: string[] = [];

    if (
      req.query?.filterBy &&
      req.query.filterBy.toString().match(new RegExp("payment", "i"))
    ) {
      const filteredOrders: IOrder[] = await Order.aggregate([
        {
          $lookup: {
            from: "transactions",
            localField: "payment",
            foreignField: "_id",
            as: "payment",
          },
        },
        {
          $unwind: {
            path: "$payment",
          },
        },
        {
          $match: {
            "payment.paymentStatus": req.query.filterValue,
          },
        },
      ]).exec();
      req.query.filterBy = undefined;
      req.query.filterValue = undefined;
      req.query = filterUndefined(req.query);
      ids = filteredOrders.map((order) => String(order._id));
    }
    const conditions = id ? { createdBy: id } : {};

    const orders = await find(Order, req, {
      _id: ids ? { $in: ids } : undefined,
      ...conditions,
    });

    return {
      success: true,
      status: 200,
      message: `Orders!`,
      data: orders,
    };
  }
  public async getOrder(req: AuthenticatedRequest, account?: IAccount) {
    const accountId =
      account?.accountType !== AccountType.Admin &&
      account?.accountType !== AccountType.Staff
        ? account?._id
        : undefined;
    const id = req.params.id;

    const conditions = accountId ? { createdBy: accountId, _id: id } : {};
    const order = await findOne(Order, req, conditions);

    return {
      success: true,
      status: 200,
      message: `Order!`,
      data: order,
    };
  }
}

export default OrderService;
