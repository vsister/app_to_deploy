import mongoose from 'mongoose';
import { DAO, MongooseModel, MongooseModelDocument } from 'daos/DAO';
import { CategorySpecificationDAO } from 'daos/SpecificationDAO/CategorySpecificationDAO';
import { DatabaseException } from 'utils/exception/DatabaseException';
import { IRangeCategorySpecificationSchema } from 'daos/SpecificationDAO/schemas';
import { ModelException } from 'utils/exception/ModelException/ModelException';
import {
  CATEGORY_GROUP_MODEL_NAME,
  CATEGORY_GROUP_SCHEMA,
  CATEGORY_MODEL_NAME,
  CATEGORY_SCHEMA,
  ICategoryGroupSchema,
  ICategorySchema,
  IParentCategorySchema,
  ISubcategorySchema,
  PARENT_CATEGORY_MODEL_NAME,
  PARENT_CATEGORY_SCHEMA,
  SUBCATEGORY_MODEL_NAME,
  SUBCATEGORY_SCHEMA,
} from './schemas';
import { ISubcategory, CategoryType } from 'shared/entities/Category';
import { ReqCreate } from 'shared/transactions/category';

export class CategoryDAO extends DAO {
  private categoryModel: MongooseModel<ICategorySchema>;
  private categoryGroupModel: MongooseModel<ICategoryGroupSchema>;
  private parentCategoryModel: MongooseModel<IParentCategorySchema>;
  private subcategoryModel: MongooseModel<ISubcategorySchema>;
  private categorySpecificationDAO: CategorySpecificationDAO;

  public constructor() {
    super();

    this.categoryModel = this.initModel(CATEGORY_MODEL_NAME, CATEGORY_SCHEMA);

    this.categoryGroupModel = this.initDiscriminator(
      this.categoryModel,
      CATEGORY_GROUP_MODEL_NAME,
      CATEGORY_GROUP_SCHEMA
    );

    this.parentCategoryModel = this.initDiscriminator(
      this.categoryModel,
      PARENT_CATEGORY_MODEL_NAME,
      PARENT_CATEGORY_SCHEMA
    );

    this.subcategoryModel = this.initDiscriminator(this.categoryModel, SUBCATEGORY_MODEL_NAME, SUBCATEGORY_SCHEMA);

    this.categorySpecificationDAO = new CategorySpecificationDAO();
  }

  public async create(category: ReqCreate): Promise<MongooseModelDocument<ICategorySchema>> {
    const document = await this.generateDocument(category);
    await document.save();
    return document;
  }

  public async search(searchSchema: Partial<ICategorySchema>): Promise<MongooseModelDocument<ICategorySchema>[]> {
    const queryResult = await this.categoryModel.find(searchSchema);

    return queryResult;
  }

  public async getOne(_id: mongoose.Types.ObjectId | string): Promise<MongooseModelDocument<ICategorySchema>> {
    const queryResult = await this.categoryModel.findOne({ _id });

    if (!queryResult) {
      throw new DatabaseException(`Category with id ${_id} has not been found in the database.`);
    }

    return queryResult;
  }

  public async getCategoryGroups(): Promise<MongooseModelDocument<ICategoryGroupSchema>[]> {
    const queryResult = await this.categoryGroupModel.find({});

    return queryResult;
  }

  public async getParentCategories(): Promise<MongooseModelDocument<IParentCategorySchema>[]> {
    const queryResult = await this.parentCategoryModel.find({});

    return queryResult;
  }

  public async getUnsignedSubcategories(): Promise<MongooseModelDocument<ISubcategorySchema>[]> {
    const queryResult = await this.subcategoryModel.find({ parentCategory: null });

    return queryResult;
  }

  public async getSubcategories(
    parentCategory: mongoose.Types.ObjectId
  ): Promise<MongooseModelDocument<ISubcategorySchema>[]> {
    const queryResult = await this.subcategoryModel.find({ parentCategory });

    return queryResult;
  }

  public async updateOne(
    _id: mongoose.Types.ObjectId | string,
    document: Partial<ICategorySchema>
  ): Promise<MongooseModelDocument<ICategorySchema>> {
    const queryDocument = await this.getOne(_id);

    switch (queryDocument.type) {
      case CategoryType.Group:
        await this.categoryGroupModel.findOneAndUpdate({ _id }, { $set: document as Partial<ICategoryGroupSchema> });
        break;
      case CategoryType.Parent:
        await this.parentCategoryModel.findOneAndUpdate({ _id }, { $set: document as Partial<IParentCategorySchema> });
        break;
      case CategoryType.Subcategory:
        await this.subcategoryModel.findOneAndUpdate({ _id }, { $set: document as Partial<ISubcategorySchema> });
        break;
      default:
        throw new DatabaseException(`found category (id: ${_id}) has an unknown type`);
    }

    await queryDocument.save();

    const updatedQuery = await this.getOne(_id);

    return updatedQuery;
  }

  public async deleteOne(_id: mongoose.Types.ObjectId): Promise<void> {
    const document = (await this.getOne(_id)) as MongooseModelDocument<ICategorySchema>;

    if (document.type === CategoryType.Group) {
      (document as MongooseModelDocument<ICategoryGroupSchema>).categories.forEach(async id => {
        await this.deleteOne(id);
      });
    }

    if (document.type === CategoryType.Parent) {
      (document as MongooseModelDocument<IParentCategorySchema>).subcategories.forEach(async id => {
        await this.deleteOne(id);
      });
    }

    await document.deleteOne();
    // await document.save();
  }

  private async generateDocument(category: Partial<ICategorySchema>): Promise<MongooseModelDocument<ICategorySchema>> {
    let document: MongooseModelDocument<ISubcategorySchema | IParentCategorySchema | ICategoryGroupSchema>;

    switch (category.type) {
      case CategoryType.Group:
        document = new this.categoryGroupModel(category);
        break;
      case CategoryType.Parent:
        document = new this.parentCategoryModel(category);
        break;
      case CategoryType.Subcategory: {
        document = new this.subcategoryModel(category);

        const { priceRange, specifications } = category as Partial<ISubcategory>;

        if (priceRange) {
          const priceRangeDocument = this.categorySpecificationDAO.generateDocument(
            priceRange
          ) as IRangeCategorySpecificationSchema<string>;

          document.priceRange = priceRangeDocument;
        }

        if (specifications) {
          document.specifications = specifications.map(specification =>
            this.categorySpecificationDAO.generateDocument(specification)
          );
          document.markModified('specifications');
        }
        break;
      }
      default:
        throw new ModelException('could not create mongoose document - unknown category type');
    }

    return document;
  }
}
