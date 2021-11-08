import bcrypt from 'bcrypt';
import { IUserSchema, UserDAO } from 'daos/UserDAO/UserDAO';
import { MongooseModelDocument } from 'daos/DAO';
import { OrderService } from 'services/Order/OrderService';
import { Service } from '../Service';
import {
  ReqUpdate,
  ResUpdate,
  ReqCreate,
  ResCreate,
  ReqGetOneById,
  ResGetOneById,
  ResGetAll,
  ReqGetOneByUsername,
  ResGetOneByUsername,
} from 'shared/transactions/user';
import { IExpert, IdentifiableUser } from 'shared/entities/User';
import { Mongoose } from 'mongoose';

export class UserService extends Service {
  protected userDAO = new UserDAO();
  protected orderService: OrderService;

  public constructor() {
    super();
  }

  public setOrderService(service: OrderService): void {
    this.orderService = service;
  }

  public async create(user: ReqCreate): Promise<ResCreate> {
    const saltRounds = 10;
    const hash = await bcrypt.hash(user.password, saltRounds);

    const { name, username, role } = user;

    const document = await this.userDAO.createOne({ name, username, role, password: hash });

    const newUser = await this.getUserEntityFromDocument(document);

    return newUser;
  }

  public async update(payload: ReqUpdate): Promise<ResUpdate> {
    let updatePayload = { ...payload };

    if (payload.password) {
      const hash = await bcrypt.hash(payload.password, 10);
      updatePayload = {
        ...payload,
        password: hash,
      };
    }

    const document = await this.userDAO.updateOne(payload._id, updatePayload as Partial<IUserSchema>);
    const user = await this.getUserEntityFromDocument(document as MongooseModelDocument<IUserSchema>);

    return user;
  }

  public async getOneById(payload: ReqGetOneById): Promise<ResGetOneById> {
    const document = await this.userDAO.getOneById(payload._id);

    const user = await this.getUserEntityFromDocument(document);

    return user;
  }

  public async getAll(): Promise<ResGetAll> {
    const users = await this.userDAO.getAll();

    return users.map(user => ({
      _id: user._id,
      username: user.username,
      name: user.name,
      role: user.role,
    }));
  }

  public async delete(userId: string): Promise<void> {
    await this.userDAO.deleteOne(userId);
  }

  public async getOneByUsername(payload: ReqGetOneByUsername): Promise<ResGetOneByUsername> {
    const document = await this.userDAO.getOneByUsername(payload.username);

    const user = await this.getUserEntityFromDocument(document);

    return user;
  }

  private async getUserEntityFromDocument(document: MongooseModelDocument<IUserSchema>): Promise<IdentifiableUser> {
    const user: IdentifiableUser = {
      _id: document._id,
      username: document.username,
      name: document.name,
      role: document.role,
    };

    return user;
  }
}
