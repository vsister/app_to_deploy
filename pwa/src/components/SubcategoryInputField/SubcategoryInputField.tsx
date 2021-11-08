import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  ChoiceSpecification,
  RangeSpecification,
  Specification,
} from '@components/CreateSubcategoryForm/CreateSubcategoryForm';
import { SpecificationType } from 'shared/entities/Specification';
import { Input } from '@ui/Input/Input';
import { Link } from '@ui/Link/Link';
import ButtonWthIcon, { ButtonThemeIcn } from '@ui/ButtonWthIcn/Button';
import inputStyles from '@ui/Input/Input.scss';
import { IconName } from '@ui/Icon/icons';

interface SubcategoryInputFieldProps {
  specification: Specification;
  updateSpecification: (specification: Specification) => void;
  deleteSpecification: () => void;
}

export const SubcategoryInputField: React.FC<SubcategoryInputFieldProps> = props => {
  const { specification, updateSpecification, deleteSpecification } = props;

  const updateName = (newName: string) => {
    const newSpecification = {
      ...specification,
      name: newName,
    };
    updateSpecification(newSpecification);
  };

  const updateType = (newType: SpecificationType) => {
    if (newType === specification.type) {
      return;
    }

    switch (newType) {
      case SpecificationType.Radio:
      case SpecificationType.Select: {
        updateSpecification({
          key: specification.key,
          type: newType,
          name: specification.name,
          nameError: '',
          values: [
            {
              key: uuidv4(),
              value: '',
              error: '',
            },
          ],
        } as ChoiceSpecification);
        break;
      }
      case SpecificationType.Range: {
        updateSpecification({
          key: specification.key,
          name: specification.name,
          nameError: '',
          type: newType,
          range: {
            minValue: 0,
            maxValue: 0,
            unit: '',
            error: '',
          },
        } as RangeSpecification);
        break;
      }
      default:
        break;
    }
  };

  const addValueToSelectOrRadio = () => {
    const oldValues = (specification as ChoiceSpecification).values;
    const newValues = [...oldValues, { key: uuidv4(), value: '' }];

    const newSpecification = {
      ...specification,
      values: newValues,
    } as ChoiceSpecification;

    updateSpecification(newSpecification);
  };

  const updateValueFromSelectOrRadio = (key: string, value: string) => {
    const { values } = specification as ChoiceSpecification;

    const newValues = values.map(newValue => {
      if (newValue.key !== key) {
        return newValue;
      }

      return {
        ...newValue,
        value,
      };
    });

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const newSpecification = {
      ...specification,
      values: newValues,
    } as ChoiceSpecification;

    updateSpecification(newSpecification);
  };

  const removeValueFromSelectOrRadio = (key: string) => {
    const { values } = specification as ChoiceSpecification;
    const newValues = [...values.filter(value => value.key !== key)];

    if (!newValues.length) {
      deleteSpecification();
    }

    const newSpecification = {
      ...specification,
      values: newValues,
    } as ChoiceSpecification;

    updateSpecification(newSpecification);
  };

  const resetErrors = () => {
    const newSpecification = { ...specification };

    newSpecification.nameError = '';

    if (newSpecification.type === SpecificationType.Range) {
      newSpecification.range.error = '';
    } else {
      newSpecification.values = newSpecification.values.map(value => ({ ...value, error: '' }));
    }

    updateSpecification(newSpecification);
  };

  const updateRangeValue = (key: 'minValue' | 'maxValue' | 'unit', e: React.ChangeEvent<HTMLInputElement>) => {
    if (key === 'unit') {
      updateSpecification({
        ...specification,
        range: {
          ...(specification as RangeSpecification).range,
          unit: e.target.value,
        },
      } as RangeSpecification);
      return;
    }

    const parsedValue = parseInt(e.target.value);

    if (parsedValue && parsedValue >= 0) {
      updateSpecification({
        ...specification,
        range: {
          ...(specification as RangeSpecification).range,
          [key]: parsedValue,
        },
      } as RangeSpecification);
    } else {
      updateSpecification({
        ...specification,
        range: {
          ...(specification as RangeSpecification).range,
          [key]: 0,
        },
      } as RangeSpecification);
    }
  };

  const renderInputFieldValues = (): JSX.Element | null => {
    switch (specification.type) {
      case SpecificationType.Radio:
      case SpecificationType.Select:
        return (
          <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
            {specification.values.map(value => (
              <div key={value.key} style={{ display: 'flex', flexFlow: 'row nowrap' }}>
                <Input
                  type="text"
                  name="specificationValue"
                  value={value.value}
                  error={value.error}
                  placeholder="Название варианта"
                  onFocus={resetErrors}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateValueFromSelectOrRadio(value.key, e.target.value)
                  }
                />
                <Link
                  style={{ marginLeft: '4px', fontSize: '18px', alignSelf: 'flex-start', width: 'auto' }}
                  name="(Удалить)"
                  onClick={() => removeValueFromSelectOrRadio(value.key)}
                />
              </div>
            ))}
            <ButtonWthIcon
              style={{ width: '40px', padding: 0 }}
              theme={ButtonThemeIcn.White}
              icon={IconName.AddField}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                addValueToSelectOrRadio();
              }}
            />
          </div>
        );
      case SpecificationType.Range:
        return (
          <>
            <Input
              style={{ marginBottom: '4px' }}
              type="text"
              name="specificationValue"
              placeholder="Мера измерения"
              value={specification.range.unit}
              error={specification.range.error}
              onFocus={resetErrors}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRangeValue('unit', e)}
            />
            <Input
              style={{ marginBottom: '4px', minWidth: '60px', maxWidth: '60px' }}
              type="number"
              name="specificationValue"
              placeholder="От"
              value={specification.range.minValue.toString()}
              onFocus={resetErrors}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRangeValue('minValue', e)}
            />
            <Input
              style={{ marginBottom: '4px', minWidth: '60px', maxWidth: '60px' }}
              type="number"
              name="specificationValue"
              placeholder="До"
              value={specification.range.maxValue.toString()}
              onFocus={resetErrors}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRangeValue('maxValue', e)}
            />
            <Link
              style={{ marginLeft: '4px', fontSize: '18px', alignSelf: 'flex-start', width: 'auto' }}
              name="(Удалить)"
              onClick={() => deleteSpecification()}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexFlow: 'row nowrap', marginBottom: '24px' }}>
      <select
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateType(e.target.value as SpecificationType)}
        value={specification.type}
        className={inputStyles.input}
      >
        <option value={SpecificationType.Radio}>Выбор одного</option>
        <option value={SpecificationType.Select}>Выбор нескольких</option>
        <option value={SpecificationType.Range}>Промежуток</option>
      </select>
      <Input
        style={{ margin: '0 8px' }}
        name="specificationName"
        type="text"
        value={specification.name}
        placeholder="Наименование"
        error={specification.nameError}
        onFocus={resetErrors}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateName(e.target.value)}
      />
      {renderInputFieldValues()}
    </div>
  );
};
