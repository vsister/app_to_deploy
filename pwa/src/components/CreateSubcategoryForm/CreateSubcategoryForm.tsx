import { RootState } from '@store';
import { categoryNameValidationSchema } from '@utils/validationSchemas';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '@ui/Form/Form.scss';
import { createCategory, createSubcategory } from '@store/thunks/catalogue';
import { Input } from '@ui/Input/Input';
import Button, { ButtonTheme } from '@ui/Button/Button';
import ButtonWthIcon, { ButtonThemeIcn } from '@ui/ButtonWthIcn/Button';
import { IconName } from '@ui/Icon/icons';
import { v4 as uuidv4 } from 'uuid';
import { SubcategoryInputField } from '@components/SubcategoryInputField/SubcategoryInputField';
import { ICategorySpecification, SpecificationType } from 'shared/entities/Specification';
import { Redirect, useParams } from 'react-router-dom';

interface BaseSubcategorySpecification {
  id?: string;
  key: string;
  type: SpecificationType;
  name: string;
  nameError: string;
}

export interface ChoiceSpecification extends BaseSubcategorySpecification {
  type: SpecificationType.Radio | SpecificationType.Select;
  values: {
    _id?: string;
    key: string;
    value: string;
    error: string;
  }[];
}

export interface RangeSpecification extends BaseSubcategorySpecification {
  type: SpecificationType.Range;
  range: {
    _id?: string;
    minValue: number;
    maxValue: number;
    unit: string;
    error: string;
  };
}

export type Specification = ChoiceSpecification | RangeSpecification;

const specificationsReducer = (state: Specification[], action: { type: string; payload?: any }) => {
  switch (action.type) {
    case 'add':
      return [
        ...state,
        {
          type: SpecificationType.Radio,
          name: '',
          nameError: '',
          values: [
            {
              key: uuidv4(),
              value: '',
              error: '',
            },
          ],
          key: uuidv4(),
        },
      ];
    case 'update':
      return state.map(specification => {
        if (specification.key !== action.payload.key) {
          return specification;
        }

        return action.payload.updatedSpecification;
      });
    case 'delete': {
      const specToDeleteIndex = state.findIndex(specification => specification.key === action.payload.key);

      const newState = [...state.slice(0, specToDeleteIndex), ...state.slice(specToDeleteIndex + 1)];

      return newState;
    }
    default:
      return state;
  }
};

export const CreateSubcategoryForm: React.FC = () => {
  const dispatch = useDispatch();
  const { currentGroup, currentCategory } = useSelector((state: RootState) => state.catalogue);
  const { groupId, categoryId } = useParams<{ groupId: string; categoryId: string }>();

  const [name, setName] = React.useState('');
  const [nameError, setNameError] = React.useState('');
  const [specifications, dispatchSpecification] = React.useReducer(specificationsReducer, []);

  if (!currentGroup || !currentCategory) {
    if (groupId && categoryId) {
      return <Redirect to={`/category/${categoryId}`} />;
    }

    return <Redirect to="/" />;
  }

  const addSpecification = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatchSpecification({ type: 'add' });
  };

  const updateSpecification = (key: string, updatedSpecification: Specification) => {
    dispatchSpecification({ type: 'update', payload: { key, updatedSpecification } });
  };

  const deleteSpecification = (key: string) => {
    dispatchSpecification({ type: 'delete', payload: { key } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let specificationsHaveError = false;

    try {
      await categoryNameValidationSchema.validate(name);
    } catch (err) {
      specificationsHaveError = true;
      setNameError(err.errors.join(''));
    }

    await Promise.all(
      (specifications as Specification[]).map(async specification => {
        const updatedSpecification = Object.assign({}, specification);

        try {
          await categoryNameValidationSchema.validate(specification.name);
        } catch (err) {
          specificationsHaveError = true;
          updatedSpecification.nameError = err.errors.join('');
        }

        if (specification.type === SpecificationType.Range) {
          if (specification.range.maxValue === 0 && specification.range.minValue === 0) {
            specificationsHaveError = true;
            ((updatedSpecification as unknown) as RangeSpecification).range.error = 'Промежуток не может быть нулевым';
          }

          try {
            await categoryNameValidationSchema.validate(specification.range.unit);
          } catch (err) {
            specificationsHaveError = true;
            ((updatedSpecification as unknown) as RangeSpecification).range.error = err.errors.join('');
          }
        }

        if (specification.type === SpecificationType.Radio || specification.type === SpecificationType.Select) {
          const values = [...specification.values];

          const newValues = await Promise.all(
            values.map(async value => {
              try {
                await categoryNameValidationSchema.validate(value.value);
                return value;
              } catch (err) {
                specificationsHaveError = true;
                const newValue = {
                  ...value,
                  error: err.errors.join(''),
                };
                return newValue;
              }
            })
          );

          ((updatedSpecification as unknown) as ChoiceSpecification).values = newValues;
        }

        updateSpecification(specification.key, updatedSpecification);
      })
    );

    if (specificationsHaveError) {
      return;
    }

    dispatch(
      createSubcategory({ groupId: currentGroup.id, categoryId: currentCategory.id, data: { name, specifications } })
    );
  };

  return (
    <form className={styles.Container} onSubmit={handleSubmit}>
      <h1 className={styles.Title}>Создать подкатегорию</h1>

      <div className={styles.Item}>
        <label className={styles.Item__label}>Название подкатегории: </label>
        <Input
          name="categoryName"
          type="text"
          error={nameError}
          onFocus={() => setNameError('')}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          value={name}
        />
      </div>
      <div className={styles.Item}>
        <label className={styles.Item__label}>Технические характеристики: </label>
        <div className={styles.Multipart}>
          {specifications.map(specification => (
            <SubcategoryInputField
              key={specification.key}
              deleteSpecification={() => deleteSpecification(specification.key)}
              updateSpecification={(specification: Specification) =>
                updateSpecification(specification.key, specification)
              }
              specification={specification}
            />
          ))}
          <ButtonWthIcon theme={ButtonThemeIcn.White} onClick={addSpecification} icon={IconName.AddField} />
        </div>
      </div>
      <Button className={styles.Submit} name="Создать" type="submit" theme={ButtonTheme.Dark} />
    </form>
  );
};
