import { Response } from "express";
import { AuthenticatedRequest } from "../types/type";
import ResponseHandler from "../middleware/response";
import { validateRequest } from "../middleware/validate";
import OrderService from "../services/order.service";
import { CreateOrderDTO, UpdateOrderDTO } from "../dto/order.dto";
import { OrderStatus } from "../constants/enums";

const response = new ResponseHandler();
const orderService = new OrderService();

class OrderController {
  public async acceptOrder(req: AuthenticatedRequest, res: Response) {
    const createDTO = await validateRequest(CreateOrderDTO, req.body);

    if (createDTO.error || !createDTO.data) {
      return response.send(res, 400, {
        data: createDTO.error,
      });
    }

    const resp = await orderService.createOrder(createDTO.data);

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async update(req: AuthenticatedRequest, res: Response) {
    const updateDTO = await validateRequest(UpdateOrderDTO, req.body);

    if (updateDTO.error || !updateDTO.data) {
      return response.send(res, 400, {
        data: updateDTO.error,
      });
    }

    const resp = await orderService.updateOrder(req.params.id, updateDTO.data);

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async closeOrder(req: AuthenticatedRequest, res: Response) {
    const resp = await orderService.changeOrderStatus(
      req.params.id,
      OrderStatus.Closed,
    );

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async completeOrder(req: AuthenticatedRequest, res: Response) {
    const resp = await orderService.changeOrderStatus(
      req.params.id,
      OrderStatus.Completed,
    );

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async deleteOrder(req: AuthenticatedRequest, res: Response) {
    const resp = await orderService.deleteOrder(req.params.id);

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async getAllOrder(req: AuthenticatedRequest, res: Response) {
    const resp = await orderService.getAllOrder(req, req.account);

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
  public async getOrder(req: AuthenticatedRequest, res: Response) {
    const resp = await orderService.getOrder(req);

    return response.send(res, resp.status, {
      message: resp.message,
      data: resp.data,
    });
  }
}

export default OrderController;
