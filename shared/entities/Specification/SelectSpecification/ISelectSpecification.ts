import { ISpecification, SpecificationType } from '../ISpecification';

export interface SelectValue {
  _id: string;
  value: string;
}

export interface ISelectSpecification extends ISpecification {
  type: SpecificationType.Select;
}

export interface ISelectProductSpecification extends ISelectSpecification {
  values: SelectValue[];
}

export interface ISelectCategorySpecification extends ISelectSpecification {
  values: SelectValue[];
}
