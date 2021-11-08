/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import {
  Specification,
  ChoiceSpecification,
  RangeSpecification,
} from '@components/CreateSubcategoryForm/CreateSubcategoryForm';
import { v4 as uuidv4 } from 'uuid';
import { ICategorySpecification, SpecificationType } from 'shared/entities/Specification';

export const prefillSubcategorySpecifications = (specifications: ICategorySpecification[]): Specification[] =>
  specifications.map(specification => {
    if (specification.type === SpecificationType.Select || specification.type === SpecificationType.Radio) {
      return {
        ...specification,
        key: uuidv4(),
        nameError: '',
        values: specification.values.map(specificationValue => ({
          ...specificationValue,
          key: uuidv4(),
          error: '',
        })),
      } as ChoiceSpecification;
    }

    return {
      ...specification,
      key: uuidv4(),
      nameError: '',
      range: {
        ...specification.range,
        error: '',
      },
    } as RangeSpecification;
  });

export const stripSpecifications = (specifications: Specification[]): any =>
  specifications.map(specification => {
    if (specification.type === SpecificationType.Select || specification.type === SpecificationType.Radio) {
      return Object.assign(
        {},
        { name: specification.name, type: specification.type },
        specification.id ? { id: specification.id } : {},
        {
          values: specification.values.map(value =>
            Object.assign({}, { value: value.value }, value._id ? { _id: value._id } : {})
          ),
        }
      ) as any;
    }

    return Object.assign(
      {},
      { name: specification.name, type: specification.type },
      specification.id ? { id: specification.id } : {},
      {
        range: Object.assign(
          {},
          {
            minValue: (specification as RangeSpecification).range.minValue,
            maxValue: (specification as RangeSpecification).range.maxValue,
            unit: (specification as RangeSpecification).range.unit,
          },
          (specification as RangeSpecification).range._id
            ? { _id: (specification as RangeSpecification).range._id }
            : {}
        ),
      }
    );
  });
