import mongoose, { Schema } from 'mongoose';
import {
  ICategorySpecificationSchema,
  IRangeCategorySpecificationSchema,
  RANGE_CATEGORY_SPECIFICATION_SCHEMA,
} from 'daos/SpecificationDAO/schemas';
import { CategoryType } from 'shared/entities/Category';

export interface ICategorySchema {
  _id: mongoose.Types.ObjectId;
  name: string;
  type: string;
}
export const CATEGORY_MODEL_NAME = 'Category';
export const CATEGORY_SCHEMA = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  {
    discriminatorKey: 'type',
  }
);

export interface ICategoryGroupSchema extends ICategorySchema {
  type: CategoryType.Group;
  categories: mongoose.Types.ObjectId[];
}

export interface IParentCategorySchema extends ICategorySchema {
  type: CategoryType.Parent;
  groupId: mongoose.Types.ObjectId;
  subcategories: mongoose.Types.ObjectId[];
}
export interface ISubcategorySchema extends ICategorySchema {
  type: CategoryType.Subcategory;
  parentId: mongoose.Types.ObjectId;
  priceRange: IRangeCategorySpecificationSchema<string>;
  products: mongoose.Types.ObjectId[];
  specifications: ICategorySpecificationSchema[];
}

export const CATEGORY_GROUP_MODEL_NAME = 'CategoryGroup';
export const PARENT_CATEGORY_MODEL_NAME = 'ParentCategory';
export const SUBCATEGORY_MODEL_NAME = 'Subcategory';

export const CATEGORY_GROUP_SCHEMA = new mongoose.Schema({
  categories: [{ type: mongoose.Types.ObjectId, default: [] }],
});

export const PARENT_CATEGORY_SCHEMA = new mongoose.Schema({
  groupId: { type: mongoose.Types.ObjectId, required: true },
  subcategories: [{ type: mongoose.Types.ObjectId, default: [] }],
});

export const SUBCATEGORY_SCHEMA = new mongoose.Schema({
  parentId: { type: mongoose.Types.ObjectId, required: true },
  priceRange: { type: RANGE_CATEGORY_SPECIFICATION_SCHEMA, required: true },
  products: [mongoose.Types.ObjectId],
  specifications: [{ type: Schema.Types.Mixed }],
});
