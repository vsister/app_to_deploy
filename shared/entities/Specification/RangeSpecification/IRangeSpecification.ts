import { ISpecification, SpecificationType } from '../ISpecification';

export interface Range<Unit> {
  _id: string;
  unit?: Unit;
  minValue: number;
  maxValue: number;
}

export interface RangeValue<Unit> {
  _id: string;
  unit?: Unit;
  value: number;
}

export interface IRangeSpecification extends ISpecification {
  type: SpecificationType.Range;
}

export interface IRangeCategorySpecification<Unit> extends IRangeSpecification {
  range: Range<Unit>;
}

export interface IRangeProductSpecification<Unit> extends IRangeSpecification {
  rangeValue: RangeValue<Unit>;
}
