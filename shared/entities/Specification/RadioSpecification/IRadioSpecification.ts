import { ISpecification, SpecificationType } from '../ISpecification';

export interface RadioValue {
  _id: string;
  value: string;
}

export interface IRadioSpecification extends ISpecification {
  type: SpecificationType.Radio;
}

export interface IRadioProductSpecification extends IRadioSpecification {
  value: RadioValue;
}

export interface IRadioCategorySpecification extends IRadioSpecification {
  values: RadioValue[];
}
