import mongoose from 'mongoose';
import { IProductSpecificationSchema, RANGE_PRODUCT_SPECIFICATION_SCHEMA } from 'daos/SpecificationDAO/schemas';
import { IRangeProductSpecification } from 'shared/entities/Specification/RangeSpecification/IRangeSpecification';

export interface IBreadcrumbSchema {
  _id: mongoose.Types.ObjectId;
  name: string;
}
export interface IProductSchema {
  _id: mongoose.Types.ObjectId;
  name: string;
  requiresVerification: boolean;
  verifiedById: mongoose.Types.ObjectId;
  price: IRangeProductSpecification<string>;
  specifications: IProductSpecificationSchema[];
  breadcrumbs: IBreadcrumbSchema[];
}

export const BREADCRUMB_SCHEMA = new mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    name: String,
  },
  { _id: false }
);

export const PRODUCT_MODEL_NAME = 'Product';
export const PRODUCT_SCHEMA = new mongoose.Schema({
  breadcrumbs: [BREADCRUMB_SCHEMA],
  name: { type: String, required: true },
  requiresVerification: { type: Boolean, default: false },
  isVerified: { type: mongoose.Types.ObjectId, default: null },
  price: RANGE_PRODUCT_SPECIFICATION_SCHEMA,
  specifications: [{ type: mongoose.Schema.Types.Mixed }],
});
export const INDEXED_PRODUCT_SCHEMA = PRODUCT_SCHEMA.index({ name: 'text' });
