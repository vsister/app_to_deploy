import { IRadioCategorySpecification, IRadioProductSpecification } from './RadioSpecification/IRadioSpecification';
import { IRangeCategorySpecification, IRangeProductSpecification } from './RangeSpecification/IRangeSpecification';
import { ISelectCategorySpecification, ISelectProductSpecification } from './SelectSpecification/ISelectSpecification';

export enum SpecificationType {
  Range = 'range',
  Radio = 'radio',
  Select = 'select',
}

export interface ISpecification {
  id: string;
  name: string;
  type: SpecificationType;
}

export type ICategorySpecification =
  | IRangeCategorySpecification<any>
  | IRadioCategorySpecification
  | ISelectCategorySpecification;

export type IProductSpecification =
  | IRangeProductSpecification<any>
  | IRadioProductSpecification
  | ISelectProductSpecification;

export interface IRangeFilter {
  specificationId: string;
  type: SpecificationType.Range;
  from: number;
  to: number;
}

export interface ISelectFilter {
  specificationId: string;
  type: SpecificationType.Select;
  valueIds: string[];
}

export interface IRadioFilter {
  specificationId: string;
  type: SpecificationType.Radio;
  valueIds: string[];
}

export type IFilter = IRangeFilter | ISelectFilter | IRadioFilter;
