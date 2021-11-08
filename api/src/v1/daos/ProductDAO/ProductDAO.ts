import mongoose from 'mongoose';
import { DAO, MongooseModel, MongooseModelDocument } from 'daos/DAO';
import { ProductSpecificationDAO } from 'daos/SpecificationDAO/ProductSpecificationDAO';
import { DatabaseException } from 'utils/exception/DatabaseException';
import { PRODUCT_MODEL_NAME, INDEXED_PRODUCT_SCHEMA, IProductSchema } from './schemas';
import { IProduct } from 'shared/entities/Product';
import { SpecificationType, IFilter, IRangeFilter } from 'shared/entities/Specification';
import { ValidationException } from 'utils/exception/ValidationException';
import { primaryDB } from 'providers/primaryDB';

export class ProductDAO extends DAO {
  private productModel: MongooseModel<IProductSchema>;
  private productSpecificationDAO: ProductSpecificationDAO;

  public constructor() {
    super();

    this.productModel = this.initModel(PRODUCT_MODEL_NAME, INDEXED_PRODUCT_SCHEMA);

    this.productSpecificationDAO = new ProductSpecificationDAO();
  }

  public async create(product: IProduct): Promise<MongooseModelDocument<IProductSchema>> {
    const document = await this.generateDocument(product);
    await document.save();
    return document;
  }

  public async getOne(_id: mongoose.Types.ObjectId | string): Promise<MongooseModelDocument<IProductSchema>> {
    const queryResult = await this.productModel.findOne({ _id });

    if (!queryResult) {
      throw new DatabaseException(`Product with id ${_id} has not been found in the database.`);
    }

    return queryResult;
  }

  public async getAll(): Promise<MongooseModelDocument<IProductSchema>[]> {
    const queryResult = await this.productModel.find({});

    if (!queryResult) {
      throw new DatabaseException(`Query failed.`);
    }

    return queryResult;
  }

  public async searchByName(name: string): Promise<MongooseModelDocument<IProductSchema>[]> {
    const query = await this.productModel.find({ $text: { $search: name } });
    return query;
  }

  public async getCount(): Promise<number> {
    const count = await this.productModel.count({});

    return count;
  }

  public async getFiltered(
    productIds: (mongoose.Types.ObjectId | string)[],
    price: IRangeFilter | null,
    specifications: IFilter[]
  ): Promise<MongooseModelDocument<IProductSchema>[]> {
    const filterQuery: any = { $and: [] };

    if (productIds.length) {
      filterQuery.$and.push({
        _id: { $in: productIds.map(productId => mongoose.Types.ObjectId(productId as string)) },
      });
    }

    if (price) {
      filterQuery.$and.push({
        'price.rangeValue.value': {
          $lte: price.to,
          $gte: price.from,
        },
      });
    }

    if (specifications.length) {
      filterQuery.$and.push({
        specifications: {
          $exists: true,
        },
      });

      specifications.forEach(specification => {
        switch (specification.type) {
          case SpecificationType.Radio:
            filterQuery.$and.push({
              specifications: {
                $elemMatch: {
                  _id: mongoose.Types.ObjectId(specification.specificationId as string),
                  'value._id': {
                    $in: specification.valueIds.map(valueId => mongoose.Types.ObjectId(valueId as string)),
                  },
                },
              },
            });
            break;
          case SpecificationType.Range:
            filterQuery.$and.push({
              specifications: {
                $elemMatch: {
                  _id: mongoose.Types.ObjectId(specification.specificationId as string),
                  'rangeValue.value': {
                    $gte: specification.from,
                    $lte: specification.to,
                  },
                },
              },
            });
            break;
          case SpecificationType.Select:
            filterQuery.$and.push({
              specifications: {
                $elemMatch: {
                  _id: mongoose.Types.ObjectId(specification.specificationId as string),
                  values: {
                    $elemMatch: {
                      _id: { $in: specification.valueIds.map(valueId => mongoose.Types.ObjectId(valueId as string)) },
                    },
                  },
                },
              },
            });
            break;
          default:
            throw new ValidationException('unknown filter type');
        }
      });
    }

    if (filterQuery.$and.length === 0) {
      return [];
    }

    const query = await this.productModel.find(filterQuery);
    return query;
  }

  public async updateOne(
    _id: mongoose.Types.ObjectId | string,
    document: Partial<IProductSchema>,
    upsert?: boolean
  ): Promise<MongooseModelDocument<IProductSchema>> {
    const oldQuery = await this.getOne(_id);
    console.log(oldQuery);

    console.log(document);

    await this.productModel.findOneAndUpdate({ _id }, { $set: document }, { upsert });

    const updatedQuery = await this.getOne(_id);
    console.log(updatedQuery);

    return updatedQuery;
  }

  public async deleteOne(_id: mongoose.Types.ObjectId): Promise<void> {
    const document = await this.getOne(_id);

    await document.deleteOne();
  }

  public async generateDocument(product: Partial<IProduct>): Promise<MongooseModelDocument<IProductSchema>> {
    const document = new this.productModel(product);

    const { price, specifications } = product;

    if (price) {
      //@ts-ignore
      document.price = this.productSpecificationDAO.generateDocument(price) as IRangeProductSpecificaitonSchema;
    }

    if (specifications) {
      document.specifications = specifications.map(specification =>
        this.productSpecificationDAO.generateDocument(specification)
      );
      document.markModified('specifications');
    }

    return document;
  }
}
