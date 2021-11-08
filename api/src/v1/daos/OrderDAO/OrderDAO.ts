import mongoose from 'mongoose';
import { DatabaseException } from 'utils/exception/DatabaseException';
import { DAO, MongooseModel, MongooseModelDocument } from 'daos/DAO';
import { ORDER_MODEL_NAME, ORDER_SCHEMA, IOrderSchema } from './schemas';
import { ReqUpdateOrder } from 'shared/transactions/order';
import { IOrder, OrderStatus } from 'shared/entities/Order';

export class OrderDAO extends DAO {
  private orderModel: MongooseModel<IOrderSchema>;

  public constructor() {
    super();
    this.orderModel = this.initModel(ORDER_MODEL_NAME, ORDER_SCHEMA);
  }

  public async create(order: Partial<IOrderSchema>): Promise<MongooseModelDocument<IOrderSchema>> {
    const document = await this.generateDocument(order);
    await document.save();
    return document;
  }

  public async getOne(_id: mongoose.Types.ObjectId | string): Promise<MongooseModelDocument<IOrderSchema>> {
    const queryResult = await this.orderModel.findOne({ _id });

    if (!queryResult) {
      throw new DatabaseException(`Order with id ${_id} has not been found in the database.`);
    }

    return queryResult;
  }

  public async updateOne(
    _id: mongoose.Types.ObjectId | string,
    payload: Partial<IOrderSchema>
  ): Promise<MongooseModelDocument<IOrderSchema>> {
    const document = await this.generateDocument(payload);
    await this.orderModel.findOneAndUpdate({ _id }, { $set: document });

    const updatedQuery = await this.getOne(_id);

    return updatedQuery;
  }

  public async getOrdersByUser(authorId: string): Promise<MongooseModelDocument<IOrderSchema>[]> {
    const queryResult = await this.orderModel.find({ authorId });

    return queryResult;
  }

  public async getOrdersByStatus(status: OrderStatus): Promise<MongooseModelDocument<IOrderSchema>[]> {
    const queryResult = await this.orderModel.find({ status });

    return queryResult;
  }

  public async getMany(): Promise<MongooseModelDocument<IOrderSchema>[]> {
    const queryResult = await this.orderModel.find({});

    return queryResult;
  }

  public async deleteOne(_id: mongoose.Types.ObjectId): Promise<void> {
    const document = await this.getOne(_id);

    await document.deleteOne();
  }

  private async generateDocument(order: Partial<IOrderSchema>): Promise<MongooseModelDocument<IOrderSchema>> {
    const document = new this.orderModel(order);
    return document;
  }
}
