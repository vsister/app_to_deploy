import express from 'express';
import { OrderFileFormat, OrderService } from 'services/Order/OrderService';
import { Controller } from 'controllers/Controller';
import { SuccessCode, SuccessResponse } from 'utils/response/SuccessResponse';
import { UserService } from 'services/User/UserService';
import { IOrder, OrderStatus } from 'shared/entities/Order';

export class OrderController extends Controller {
  protected orderService: OrderService;
  protected userService: UserService;

  public constructor() {
    super();

    this.userService = new UserService();
    this.orderService = new OrderService(this.userService);
  }

  public async create(req: express.Request, res: express.Response): Promise<void> {
    const { body } = req;

    const newOrder = await this.orderService.create(body);

    const successResponse = new SuccessResponse(SuccessCode.OK, newOrder);

    successResponse.send(res);
  }

  public async getDocument(req: express.Request, res: express.Response): Promise<void> {
    const { orderId } = req.params;

    const order = await this.orderService.getOne(orderId);
    const orderDocumentBuffer = await this.orderService.getOrderDocument(orderId, OrderFileFormat.Docx);

    try {
      res.contentType('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename=${order.meta.orderNumber}.docx`);
      res.writeHead(200);
      res.end(Buffer.from(orderDocumentBuffer, 'base64'));
    } catch (e) {
      console.log(e);
    }
  }

  public async getOne(req: express.Request, res: express.Response): Promise<void> {
    const { orderId } = req.params;

    const order = await this.orderService.getOne(orderId);

    const successResponse = new SuccessResponse(SuccessCode.OK, order);

    successResponse.send(res);
  }

  public async getMany(req: express.Request, res: express.Response): Promise<void> {
    const { user, status } = req.query;

    let orders: IOrder[] = [];

    if (user) {
      orders = await this.orderService.getUserOrders(user as string);
    } else if (status) {
      orders = await this.orderService.getOrdersByStatus(status as OrderStatus);
    } else {
      orders = await this.orderService.getAllOrders();
    }

    const successResponse = new SuccessResponse(SuccessCode.OK, orders);

    successResponse.send(res);
  }
}
