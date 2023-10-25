import moment from "moment";
import { OrderStatus, PaymentStatus, RequestStatus } from "../constants/enums";
import Order from "../models/Order";
import Request from "../models/Request";
import Transaction from "../models/Transaction";
import { IServiceReturn } from "../types/type";

class StatisticsService {
  public async summary(): Promise<IServiceReturn> {
    const totalRequests = await Request.countDocuments();

    const payments = await Transaction.find().lean();
    const allPayments = payments.reduce((sum, payment) => {
      if (payment.fulfilledPayments && payment.fulfilledPayments.length > 0) {
        return (
          sum +
          payment.fulfilledPayments.reduce(
            (total, pay) => total + pay.amount,
            0,
          )
        );
      }
      return sum;
    }, 0);

    const confirmedPayments = payments.reduce((sum, payment) => {
      if (payment.fulfilledPayments && payment.fulfilledPayments.length > 0) {
        return (
          sum +
          payment.fulfilledPayments.reduce((total, pay) => {
            if (pay.isConfirmed) {
              return total + pay.amount;
            }
            return total;
          }, 0)
        );
      }
      return sum;
    }, 0);

    const pendingPayments = payments.reduce((sum, payment) => {
      if (payment.paymentStatus === PaymentStatus.Pending) {
        if (payment.fulfilledPayments && payment.fulfilledPayments.length > 0) {
          return (
            sum +
            (payment.amount -
              payment.fulfilledPayments.reduce((total, pay) => {
                if (pay.isConfirmed) {
                  return total + pay.amount;
                }
                return total;
              }, 0))
          );
        }
        return payment.amount + sum;
      }
      return sum;
    }, 0);

    const newOrders = await Order.countDocuments({
      orderStatus: OrderStatus.Pending,
      acceptedDate: {
        $gt: moment().subtract(1, "day").toISOString(),
      },
    });
    const newRequests = await Request.countDocuments({
      requestStatus: RequestStatus.Pending,
      date: {
        $gt: moment().subtract(1, "day").toISOString(),
      },
    });

    const currentYear = moment().year();

    const monthlyRevenue = await Transaction.aggregate([
      {
        $match: {
          createdAt: {
            $gte: moment().year(currentYear).startOf("year").toDate(),
            $lt: moment()
              .year(currentYear + 1)
              .startOf("year")
              .toDate(),
          },
        },
      },
      {
        $unwind: "$fulfilledPayments",
      },
      {
        $match: {
          "fulfilledPayments.isConfirmed": true,
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$fulfilledPayments.amount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]).exec();

    return {
      status: 200,
      message: "Summary",
      success: true,
      data: {
        totalRequests,
        allPayments,
        confirmedPayments,
        pendingPayments,
        newOrders,
        newRequests,
        monthlyRevenue,
        averageRevenue: 0,
      },
    };
  }
}

export default StatisticsService;
