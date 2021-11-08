import React, { useReducer } from 'react';
import styles from '@ui/Form/Form.scss';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '@store';
import { Input } from '@ui/Input/Input';
import ButtonWthIcon, { ButtonThemeIcn } from '@ui/ButtonWthIcn/Button';
import { IconName } from '@ui/Icon/icons';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { ProductInputField } from '@components/ProductInputField/ProductInputField';
import { Link } from '@ui/Link/Link';
import { deleteSubcategory } from '@store/thunks/catalogue';
import Button, { ButtonTheme } from '@ui/Button/Button';
import { categoryNameValidationSchema } from '@utils/validationSchemas';
import {
  IProductSpecification,
  ICategorySpecification,
  ISelectProductSpecification,
  IRangeProductSpecification,
  IRadioProductSpecification,
  RadioValue,
  RangeValue,
  SelectValue,
  SpecificationType,
} from 'shared/entities/Specification';
import { createUser } from '@store/thunks/user';
import { createProduct, updateProduct } from '@store/thunks/product';
import { current } from '@reduxjs/toolkit';

export interface BaseProductSpecification {
  error: string;
  key: string;
  categorySpecification: ICategorySpecification;
}

export interface RadioProductSpecification extends BaseProductSpecification {
  value: RadioValue | null;
}

export interface SelectProductSpecification extends BaseProductSpecification {
  values: SelectValue[];
}

export interface RangeProductSpecfication extends BaseProductSpecification {
  rangeValue: RangeValue<any>;
}

export type ProductSpecification = RadioProductSpecification | SelectProductSpecification | RangeProductSpecfication;

export const productSpecificationsReducer = (
  state: ProductSpecification[],
  action: { type: 'set' | 'add' | 'update' | 'delete'; payload: any }
): ProductSpecification[] => {
  switch (action.type) {
    case 'set':
      return action.payload;
    case 'add':
      return [...state, action.payload];
    case 'update':
      return state.map(productSpecification => {
        if (productSpecification.key !== action.payload.key) {
          return productSpecification;
        }

        return action.payload.updatedSpecification;
      });
    case 'delete': {
      const specToDeleteIndex = state.findIndex(productSpecification => productSpecification.key === action.payload);

      const newState = [...state.slice(0, specToDeleteIndex), ...state.slice(specToDeleteIndex + 1)];

      return newState;
    }
    default:
      return state;
  }
};

export const EditProductForm: React.FC = () => {
  const { currentGroup, currentCategory, currentSubcategory } = useSelector((state: RootState) => state.catalogue);
  const { product } = useSelector((state: RootState) => state.product);
  const history = useHistory();
  const { categoryId, subcategoryId } = useParams<{ subcategoryId: string; categoryId: string }>();
  const dispatch = useDispatch();

  const [id, setId] = React.useState('');
  const [name, setName] = React.useState('');
  const [nameError, setNameError] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [priceError, setPriceError] = React.useState('');
  const [unusedSpecifications, setUnusedSpecifications] = React.useState<ICategorySpecification[]>([]);

  const [productSpecifications, dispatchProductSpecificationAction] = useReducer(productSpecificationsReducer, []);

  React.useEffect(() => {
    if (product) {
      setId(product.id);
      setName(product.name);
      setPrice(product.price.rangeValue.value.toString());
      dispatchProductSpecificationAction({
        type: 'set',
        payload: product.specifications.map(specification => {
          if (currentSubcategory) {
            switch (specification.type) {
              case SpecificationType.Radio:
                return {
                  value: (specification as IRadioProductSpecification).value,
                  categorySpecification: currentSubcategory.specifications.find(
                    subcategorySpecification => subcategorySpecification.id === specification.id
                  ),
                  key: uuidv4(),
                  error: '',
                } as RadioProductSpecification;
              case SpecificationType.Range:
                return {
                  rangeValue: (specification as IRangeProductSpecification<any>).rangeValue,
                  categorySpecification: currentSubcategory.specifications.find(
                    subcategorySpecification => subcategorySpecification.id === specification.id
                  ),
                  key: uuidv4(),
                  error: '',
                } as RangeProductSpecfication;
              case SpecificationType.Select:
                return {
                  values: (specification as ISelectProductSpecification).values,
                  categorySpecification: currentSubcategory.specifications.find(
                    subcategorySpecification => subcategorySpecification.id === specification.id
                  ),
                  key: uuidv4(),
                  error: '',
                } as SelectProductSpecification;
              default:
                throw new Error('unknown specification');
            }
          }
        }),
      });
    }
  }, [product]);

  const getUnusedSpecifications = (): ICategorySpecification[] => {
    if (currentSubcategory) {
      return currentSubcategory.specifications.filter(
        subcategorySpecification =>
          !productSpecifications.find(
            productSpecification => productSpecification.categorySpecification.id === subcategorySpecification.id
          )
      );
    }

    throw new Error('no specification');
  };

  React.useEffect((): void => {
    if (!currentSubcategory) {
      history.push(`/category/${categoryId}/subcategory/${subcategoryId}`);
    } else {
      setUnusedSpecifications(getUnusedSpecifications());
    }
  }, [productSpecifications]);

  const transformCategorySpecificationToProductSpecification = (
    specification: ICategorySpecification
  ): ProductSpecification => {
    switch (specification.type) {
      case SpecificationType.Radio:
        return {
          error: '',
          key: uuidv4(),
          value: {
            _id: specification.values[0]._id,
            value: specification.values[0].value,
          },
          categorySpecification: specification,
        } as RadioProductSpecification;
      case SpecificationType.Select:
        return {
          error: '',
          key: uuidv4(),
          values: [],
          categorySpecification: specification,
        } as SelectProductSpecification;
      case SpecificationType.Range:
        return {
          error: '',
          key: uuidv4(),
          rangeValue: {
            _id: specification.range._id,
            value: specification.range.minValue,
            unit: specification.range.unit,
          },
          categorySpecification: specification,
        } as RangeProductSpecfication;
      default:
        throw new Error('bad spec type');
    }
  };

  const addProductSpecification = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (unusedSpecifications.length) {
      dispatchProductSpecificationAction({
        type: 'add',
        payload: transformCategorySpecificationToProductSpecification(unusedSpecifications[0]),
      });
    }
  };

  const changeSpecification = (key: string, idOfSpecificationToUse: string) => {
    const specificationToUse = unusedSpecifications.find(
      unusedSpecification => unusedSpecification.id === idOfSpecificationToUse
    );
    if (specificationToUse) {
      dispatchProductSpecificationAction({
        type: 'update',
        payload: {
          key,
          updatedSpecification: transformCategorySpecificationToProductSpecification(specificationToUse),
        },
      });
    }
  };

  const updateProductSpecification = (key: string, newSpecification: ProductSpecification) => {
    dispatchProductSpecificationAction({
      type: 'update',
      payload: { key, updatedSpecification: newSpecification },
    });
  };

  const deleteProductSpecification = (key: string) => {
    dispatchProductSpecificationAction({ type: 'delete', payload: key });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let productHasErrors = false;

    try {
      await categoryNameValidationSchema.validate(name);
    } catch (err) {
      productHasErrors = true;
      setNameError(err.errors.join(''));
    }

    const priceRegex = new RegExp(/^[0-9]+(\.[0-9]{2})?$/g);
    if (!priceRegex.test(price)) {
      productHasErrors = true;
      setPriceError('Некорректный формат цены. Корректный формат - 1234.56');
    } else {
      const parsedPrice = parseFloat(price).toFixed(2);
      if (!parsedPrice) {
        productHasErrors = true;
        setPriceError('Ошибка обработки цены.');
      }
    }

    const parsedProductSpecifications = productSpecifications.map(productSpecification => {
      const { categorySpecification } = productSpecification;
      switch (categorySpecification.type) {
        case SpecificationType.Select:
          if (!(productSpecification as SelectProductSpecification).values.length) {
            productHasErrors = true;
            updateProductSpecification(productSpecification.key, {
              ...productSpecification,
              error: 'Необходимо выбрать хотя-бы одно значение',
            });
            return null;
          }
          console.log((productSpecification as SelectProductSpecification).values);
          return {
            id: categorySpecification.id,
            name: categorySpecification.name,
            type: categorySpecification.type,
            values: (productSpecification as SelectProductSpecification).values,
          } as ISelectProductSpecification;
        case SpecificationType.Range:
          console.log((productSpecification as RangeProductSpecfication).rangeValue);
          return {
            id: categorySpecification.id,
            name: categorySpecification.name,
            type: categorySpecification.type,
            rangeValue: (productSpecification as RangeProductSpecfication).rangeValue,
          } as IRangeProductSpecification<any>;
        case SpecificationType.Radio:
          console.log((productSpecification as RadioProductSpecification).value);
          return {
            id: categorySpecification.id,
            name: categorySpecification.name,
            type: categorySpecification.type,
            value: (productSpecification as RadioProductSpecification).value,
          } as IRadioProductSpecification;
        default:
          throw new Error('unknown specification type');
      }
    });

    if (productHasErrors) {
      return;
    }

    if (currentGroup && currentCategory && currentSubcategory && product) {
      console.log({
        categoryId: currentCategory.id,
        subcategoryId: currentSubcategory.id,
        productId: product.id,
        body: {
          name,
          price: {
            ...product.price,
            rangeValue: {
              ...product.price.rangeValue,
              value: parseFloat(price),
            },
          },
          specifications: parsedProductSpecifications,
        },
      });
      dispatch(
        updateProduct({
          categoryId: currentCategory.id,
          subcategoryId: currentSubcategory.id,
          productId: product.id,
          body: {
            name,
            price: {
              ...product.price,
              rangeValue: {
                ...product.price.rangeValue,
                value: parseFloat(price),
              },
            },
            specifications: parsedProductSpecifications,
          },
        })
      );
    }
  };

  return (
    <form className={styles.Container} onSubmit={handleSubmit}>
      <h1 className={styles.Title}>Править позицию</h1>
      <div className={styles.Item}>
        <label className={styles.Item__label}>Название позиции: </label>
        <Input
          name="productName"
          type="text"
          error={nameError}
          placeholder="Наименование"
          onFocus={() => setNameError('')}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          value={name}
        />
      </div>
      <div className={styles.Item}>
        <label className={styles.Item__label}>Цена позиции: </label>
        <Input
          name="productPrice"
          type="text"
          placeholder="100.50"
          error={priceError}
          onFocus={() => setPriceError('')}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
          value={price}
        />
      </div>
      <div className={styles.Item}>
        <label className={styles.Item__label}>Технические характеристики</label>
        <div className={styles.Multipart}>
          {productSpecifications.map(productSpecification => (
            <div key={productSpecification.key} style={{ display: 'flex', flexFlow: 'row nowrap' }}>
              <div>
                <ProductInputField
                  specification={productSpecification}
                  unusedSpecifications={unusedSpecifications}
                  changeSpecification={changeSpecification}
                  updateSpecification={(specification: ProductSpecification) =>
                    updateProductSpecification(productSpecification.key, specification)
                  }
                  deleteSpecification={() => {}}
                >
                  {productSpecification.categorySpecification.name}
                </ProductInputField>
              </div>
              <Link
                name="(убрать)"
                style={{ fontSize: '16px', height: '16px', width: 'auto' }}
                onClick={() => deleteProductSpecification(productSpecification.key)}
              />
            </div>
          ))}
          {unusedSpecifications.length !== 0 && (
            <ButtonWthIcon
              style={{ width: '40px', padding: '0' }}
              theme={ButtonThemeIcn.White}
              onClick={addProductSpecification}
              icon={IconName.AddField}
            />
          )}
        </div>
      </div>

      <Button className={styles.Submit} name="Обновить" type="submit" theme={ButtonTheme.Dark} />
    </form>
  );
};
