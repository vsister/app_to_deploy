import mongoose from 'mongoose';
import { DAO, MongooseModel, MongooseModelDocument } from 'daos/DAO';
import { DatabaseException } from 'utils/exception/DatabaseException';
import { IUser } from 'shared/entities/User';
import { IMongooseIdentifiable } from 'shared/entities/Base';

export type IUserSchema = IUser & IMongooseIdentifiable;

export const USER_MODEL_NAME = 'USER';

export const USER_SCHEMA = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  role: { type: String, required: true },
  password: { type: String, required: true },
});

export class UserDAO extends DAO {
  private userModel: MongooseModel<any>; // quickfix any

  public constructor() {
    super();

    this.userModel = this.initModel<IUser>(USER_MODEL_NAME, USER_SCHEMA);
  }

  public async createOne(data: IUser): Promise<MongooseModelDocument<IUserSchema>> {
    try {
      const newUser = new this.userModel(data);
      await newUser.save();
      return newUser;
    } catch (err) {
      throw new DatabaseException(err);
    }
  }

  public async updateOne(
    _id: mongoose.Types.ObjectId | string,
    document: Partial<IUserSchema>
  ): Promise<MongooseModelDocument<IUserSchema>> {
    await this.userModel.findOneAndUpdate({ _id }, { $set: document });

    const updatedQuery = await this.getOneById(_id);

    return updatedQuery;
  }

  public async getOneByUsername(queryUsername: string): Promise<MongooseModelDocument<IUserSchema>> {
    const query = await this.userModel.findOne({ username: queryUsername });

    if (!query) {
      throw new DatabaseException('getOneByUsername - query failed');
    }

    return query;
  }

  public async getOneById(_id: mongoose.Types.ObjectId | string): Promise<MongooseModelDocument<IUserSchema>> {
    const query = await this.userModel.findById(_id);

    if (!query) {
      throw new DatabaseException('getOneById - query failed');
    }

    return query;
  }

  public async deleteOne(_id: mongoose.Types.ObjectId | string): Promise<void> {
    const document = await this.getOneById(_id);

    await document.deleteOne();
  }

  public async getAll(): Promise<MongooseModelDocument<IUserSchema>[]> {
    const query = await this.userModel.find({});

    if (!query) {
      throw new DatabaseException('getAll - query failed');
    }

    return query;
  }
}
