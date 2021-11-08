import { OrderDAO } from 'daos/OrderDAO/OrderDAO';
import { CategoryService } from 'services/Category/CategoryService';
import { ProductService } from 'services/Product/ProductService';
import { IOrderSchema } from 'daos/OrderDAO/schemas';
import { MongooseModelDocument } from 'daos/DAO';
import { renderDoc } from 'providers/DocumentGenerator/generator';
import { Service } from 'services/Service';
import { ReqCreateOrder, ReqUpdateOrder, ResUpdateOrder } from 'shared/transactions/order';
import { IQuantifiableProduct } from 'shared/entities/Product';
import { IOrder, OrderStatus } from 'shared/entities/Order';
import { UserService } from 'services/User/UserService';
import { ValidationException } from 'utils/exception/ValidationException';

export enum OrderFileFormat {
  Docx = 'docx',
}

export class OrderService extends Service {
  protected orderDAO: OrderDAO;
  protected categoryService: CategoryService;
  protected productService: ProductService;

  public constructor(protected userService: UserService) {
    super();
    this.orderDAO = new OrderDAO();
    this.categoryService = new CategoryService();
    this.productService = new ProductService(this.categoryService);
  }

  public async create(payload: ReqCreateOrder): Promise<IOrder> {
    const newOrder: Omit<IOrderSchema, '_id'> = {
      name: payload.name,
      authorId: payload.author,
      status: OrderStatus.Pending,
      meta: payload.meta,
      createdAt: new Date(),
      products: payload.products,
    };

    const newOrderDocument = await this.orderDAO.create(newOrder);
    const orderEntity = await this.getOrderEntityFromDocument(newOrderDocument);
    return orderEntity;
  }

  public async getOne(id: string): Promise<IOrder> {
    const orderDocument = await this.orderDAO.getOne(id);
    return this.getOrderEntityFromDocument(orderDocument);
  }

  public async update(id: string, payload: ReqUpdateOrder): Promise<IOrder> {
    const productUpdateDocument = await this.orderDAO.updateOne(id, payload as Partial<IOrderSchema>);

    const order = await this.getOrderEntityFromDocument(productUpdateDocument);

    return order;
  }

  public async getOrderDocument(id: string, format: OrderFileFormat): Promise<string> {
    const orderDocument = await this.orderDAO.getOne(id);

    const order = await this.getOrderEntityFromDocument(orderDocument);

    switch (format) {
      case OrderFileFormat.Docx: {
        const buffer = await renderDoc(order);
        return buffer;
      }
      default:
        throw new ValidationException('Unknown order file format was specified. Supported formats are: .docx');
    }
  }

  public async getUserOrders(userId: string): Promise<IOrder[]> {
    const user = await this.userService.getOneById({ _id: userId });

    const userOrderDocuments = await this.orderDAO.getOrdersByUser(user._id);

    const userOrders = Promise.all(
      userOrderDocuments.map(async userOrderDocument => this.getOrderEntityFromDocument(userOrderDocument))
    );

    return userOrders;
  }

  public async getOrdersByStatus(status: OrderStatus): Promise<IOrder[]> {
    const ordersWithStatusDocuments = await this.orderDAO.getOrdersByStatus(status);

    const ordersWithStatus = Promise.all(
      ordersWithStatusDocuments.map(async orderDocument => this.getOrderEntityFromDocument(orderDocument))
    );

    return ordersWithStatus;
  }

  public async getAllOrders(): Promise<IOrder[]> {
    const orderDocuments = await this.orderDAO.getMany();

    const orders = Promise.all(
      orderDocuments.map(async orderDocument => this.getOrderEntityFromDocument(orderDocument))
    );

    return orders;
  }

  private async getOrderEntityFromDocument(document: MongooseModelDocument<IOrderSchema>): Promise<IOrder> {
    const fullProducts: IQuantifiableProduct[] = [];
    document.products.forEach(async productDocument => {
      const fullProduct = await this.productService.getOne({ _id: productDocument.id });
      fullProducts.push({
        ...fullProduct,
        quantity: productDocument.quantity,
      });
    });

    const author = await this.userService.getOneById({ _id: document.authorId });

    return {
      name: document.name,
      status: document.status,
      createdAt: document.createdAt,
      id: document._id,
      author,
      meta: document.meta,
      products: fullProducts,
    } as IOrder;
  }
}
