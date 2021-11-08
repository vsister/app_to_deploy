// WARN: данный файл депрецирован, инициализация моделей вынесена в базовый класс модели
import mongoose from 'mongoose';
import { DatabaseException } from 'utils/exception/DatabaseException';
import { isDbSchemaError } from 'utils/isDbSchemaError';

export type MongooseModelDocument<Model> = Model & mongoose.Document;

export type MongooseModel<Model> = mongoose.Model<MongooseModelDocument<Model>>;

export class DAO {
  protected initModel<Model>(modelName: string, schema: mongoose.Schema, collection?: string): MongooseModel<Model> {
    try {
      return mongoose.model<MongooseModelDocument<Model>>(modelName);
    } catch (err) {
      if (isDbSchemaError(err)) {
        return collection
          ? mongoose.model<MongooseModelDocument<Model>>(modelName, schema, collection)
          : mongoose.model<MongooseModelDocument<Model>>(modelName, schema);
      }

      throw new DatabaseException(err);
    }
  }

  protected initDiscriminator<Model, DiscriminatorModel>(
    model: MongooseModel<Model>,
    discriminatorName: string,
    schema: mongoose.Schema
  ): MongooseModel<DiscriminatorModel> {
    if (model.discriminators && model.discriminators[discriminatorName]) {
      return model.discriminators[discriminatorName];
    }

    return model.discriminator(discriminatorName, schema);
  }
}
