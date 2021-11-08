import {
  ProductSpecification,
  RadioProductSpecification,
  RangeProductSpecfication,
  SelectProductSpecification,
} from '@components/CreateProductForm/CreateProductForm';
import { ICategorySpecification, SpecificationType, IRangeCategorySpecification } from 'shared/entities/Specification';
import React from 'react';
import inputStyles from '@ui/Input/Input.scss';
import { Input } from '@ui/Input/Input';
import { useSelector } from 'react-redux';
import { RootState } from '@store';
import { parse } from 'uuid';

interface ProductInputFieldProps {
  specification: ProductSpecification;
  unusedSpecifications: ICategorySpecification[];
  changeSpecification: (key: string, idOfSpecificationToUse: string) => void;
  updateSpecification: (specification: ProductSpecification) => void;
  deleteSpecification: () => void;
}

export const ProductInputField: React.FC<ProductInputFieldProps> = props => {
  const { currentSubcategory } = useSelector((state: RootState) => state.catalogue);
  const { specification, unusedSpecifications, changeSpecification, updateSpecification } = props;

  const renderInputFieldValues = () => {
    const { categorySpecification } = specification;
    switch (categorySpecification.type) {
      case SpecificationType.Radio:
        return (
          <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
            {categorySpecification.values.map(radioValue => (
              <div key={radioValue._id}>
                <input
                  name={categorySpecification.name}
                  type="radio"
                  checked={radioValue._id === (specification as RadioProductSpecification).value?._id}
                  onChange={() =>
                    updateSpecification({
                      ...specification,
                      value: radioValue,
                    })
                  }
                />
                <label htmlFor={radioValue.value}>{radioValue.value}</label>
              </div>
            ))}
          </div>
        );
      case SpecificationType.Range:
        return (
          <div style={{ display: 'flex', flexFlow: 'row nowrap' }}>
            <Input
              type="number"
              onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
                const parsedValue = parseInt(e.target.value);
                if (parsedValue) {
                  if (parsedValue < categorySpecification.range.minValue) {
                    updateSpecification({
                      ...specification,
                      rangeValue: {
                        ...(specification as RangeProductSpecfication).rangeValue,
                        value: categorySpecification.range.minValue,
                      },
                    });
                  } else if (parsedValue > categorySpecification.range.maxValue) {
                    updateSpecification({
                      ...specification,
                      rangeValue: {
                        ...(specification as RangeProductSpecfication).rangeValue,
                        value: categorySpecification.range.maxValue,
                      },
                    });
                  }
                } else {
                  updateSpecification({
                    ...specification,
                    rangeValue: {
                      ...(specification as RangeProductSpecfication).rangeValue,
                      value: categorySpecification.range.minValue,
                    },
                  });
                }
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateSpecification({
                  ...specification,
                  rangeValue: {
                    ...(specification as RangeProductSpecfication).rangeValue,
                    // @ts-expect-error because we need to update on blur only
                    value: e.target.value,
                  },
                });
              }}
              value={(specification as RangeProductSpecfication).rangeValue.value.toString()}
              name={categorySpecification.id}
            />
          </div>
        );
      case SpecificationType.Select:
        return (
          <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
            {categorySpecification.values.map(selectValue => {
              const valueIsSelected = Boolean(
                specification &&
                  (specification as SelectProductSpecification).values.find(
                    specificationValue => specificationValue._id === selectValue._id
                  )
              );

              return (
                <div key={selectValue._id}>
                  <input
                    name={selectValue._id}
                    type="checkbox"
                    checked={valueIsSelected}
                    onChange={() => {
                      updateSpecification({
                        ...specification,
                        values: valueIsSelected
                          ? (specification as SelectProductSpecification).values.filter(
                              value => value._id !== selectValue._id
                            )
                          : [...(specification as SelectProductSpecification).values, selectValue],
                      });
                    }}
                  />
                  <label htmlFor={selectValue._id}>{selectValue.value}</label>
                </div>
              );
            })}
          </div>
        );
      default:
        throw new Error('unknown specification type');
    }
  };

  return (
    <div style={{ display: 'flex', flexFlow: 'row nowrap', margin: '0 12px 24px 0' }}>
      <div>
        <select
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            changeSpecification(specification.key, e.target.value as SpecificationType)
          }
          value={specification.categorySpecification.id}
          className={inputStyles.input}
        >
          {currentSubcategory &&
            currentSubcategory.specifications.map(currentSpecification => (
              <option
                disabled={
                  !unusedSpecifications.find(unusedSpecification => currentSpecification.id === unusedSpecification.id)
                }
                key={currentSpecification.id}
                value={currentSpecification.id}
              >
                {currentSpecification.name}
              </option>
            ))}
        </select>
        {specification.error && (
          <p style={{ color: 'red', fontSize: '14px', width: '200px', overflowWrap: 'break-word' }}>
            {specification.error}
          </p>
        )}
      </div>
      {renderInputFieldValues()}
    </div>
  );
};
