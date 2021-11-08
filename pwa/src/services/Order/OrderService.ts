import { Response, Service } from '@services/Service';
import { ReqCreateOrder } from 'shared/transactions/order';
import { OrderStatus } from 'shared/entities/Order';

export class OrderService extends Service {
  public async createOrder(order: ReqCreateOrder, token: string): Promise<Response> {
    return this.post({ url: 'order', token, isJSON: true, body: order });
  }

  public async getDocument(orderId: string, token: string): Promise<void> {
    window.location.href = `localhost:3000/order/${orderId}/document`;
  }

  public async getUserOrders(userId: string, token: string): Promise<Response> {
    const response = await this.get({ url: `order?user=${userId}`, token });

    return response;
  }

  public async getOrdersByStatus(status: OrderStatus, token: string): Promise<Response> {
    const response = await this.get({ url: `order?status=${status}`, token });

    return response;
  }

  public async getOrders(token: string): Promise<Response> {
    const response = await this.get({ url: `order`, token });

    return response;
  }
}
