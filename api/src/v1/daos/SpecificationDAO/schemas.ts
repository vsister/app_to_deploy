import mongoose from 'mongoose';
import {
  ISpecification,
  IRangeProductSpecification,
  IRadioProductSpecification,
  ISelectProductSpecification,
  IRangeCategorySpecification,
  IRadioCategorySpecification,
  ISelectCategorySpecification,
} from 'shared/entities/Specification';
import { IMongooseIdentifiable } from 'shared/entities/Base';

export type ISpecificationSchema = ISpecification & IMongooseIdentifiable;

export type IRangeProductSpecificaitonSchema = IRangeProductSpecification<any> & IMongooseIdentifiable;
export type IRadioProductSpecificaitonSchema = IRadioProductSpecification & IMongooseIdentifiable;
export type ISelectProductSpecificaitonSchema = ISelectProductSpecification & IMongooseIdentifiable;

export type IProductSpecificationSchema =
  | IRangeProductSpecificaitonSchema
  | IRadioProductSpecificaitonSchema
  | ISelectProductSpecificaitonSchema;

export type IRangeCategorySpecificationSchema<T> = IRangeCategorySpecification<T> & IMongooseIdentifiable;
export type IRadioCategorySpecificationSchema = IRadioCategorySpecification & IMongooseIdentifiable;
export type ISelectCategorySpecificationSchema = ISelectCategorySpecification & IMongooseIdentifiable;

export type ICategorySpecificationSchema =
  | IRangeCategorySpecificationSchema<any>
  | IRadioCategorySpecificationSchema
  | ISelectCategorySpecificationSchema;

export const SELECT_SCHEMA = new mongoose.Schema({
  value: { type: String, required: true },
});

export const SELECT_VALUE_SCHEMA = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

export const RANGE_SCHEMA = new mongoose.Schema({
  unit: { type: String, required: true },
  minValue: { type: Number, default: 0 },
  maxValue: { type: Number, default: 0 },
});

export const RANGE_VALUE_SCHEMA = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: true },
    unit: { type: String, required: false },
    value: { type: Number, required: true },
  },
  { _id: false }
);

export const RADIO_SCHEMA = new mongoose.Schema({
  value: { type: String, required: true },
});

export const RADIO_VALUE_SCHEMA = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

export const SPECIFICATION_MODEL_NAME = 'Specification';
export const SPECIFICATION_SCHEMA = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
});

export const SELECT_PRODUCT_SPECIFICATION_MODEL_NAME = 'SelectProductSpecification';
export const SELECT_PRODUCT_SPECIFICATION_SCHEMA = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    _id: { type: mongoose.Types.ObjectId, required: true },
    values: [SELECT_VALUE_SCHEMA],
  },
  { _id: false }
);

export const RANGE_PRODUCT_SPECIFICATION_MODEL_NAME = 'RangeProductSpecification';
export const RANGE_PRODUCT_SPECIFICATION_SCHEMA = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    _id: { type: mongoose.Types.ObjectId, required: true },
    rangeValue: RANGE_VALUE_SCHEMA,
  },
  { _id: false }
);

export const RADIO_PRODUCT_SPECIFICATION_MODEL_NAME = 'RadioProductSpecification';
export const RADIO_PRODUCT_SPECIFICATION_SCHEMA = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    _id: { type: mongoose.Types.ObjectId, required: true },
    value: RADIO_VALUE_SCHEMA,
  },
  { _id: false }
);

export const SELECT_CATEGORY_SPECIFICATION_MODEL_NAME = 'SelectCategorySpecification';
export const SELECT_CATEGORY_SPECIFICATION_SCHEMA = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  values: [SELECT_SCHEMA],
});

export const RANGE_CATEGORY_SPECIFICATION_MODEL_NAME = 'RangeCategorySpecification';
export const RANGE_CATEGORY_SPECIFICATION_SCHEMA = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  range: RANGE_SCHEMA,
});

export const RADIO_CATEGORY_SPECIFICATION_MODEL_NAME = 'RadioCategorySpecification';
export const RADIO_CATEGORY_SPECIFICATION_SCHEMA = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  values: [RADIO_SCHEMA],
});
