import React from 'react';
import { RootState } from '@store';
import { useDispatch, useSelector } from 'react-redux';
import { IProduct } from 'shared/entities/Product';
import { SpecificationType } from 'shared/entities/Specification';
import styles from './Product.scss';
import { Link } from '@ui/Link/Link';
import { Input } from '@ui/Input/Input';
import Button, { ButtonTheme } from '@ui/Button/Button';
import { cartSlice } from '@store/slices/cart';
import { current } from '@reduxjs/toolkit';

interface ProductProps {
  product: IProduct;
}

export const Product: React.FC<ProductProps> = props => {
  const { product } = props;
  const { name, price } = product;
  const { currentCategory, currentSubcategory } = useSelector((state: RootState) => state.catalogue);

  const dispatch = useDispatch();
  const [amount, setAmount] = React.useState(1);

  const addToCart = () => {
    dispatch(cartSlice.actions.addToCart({ product, quantity: amount }));
  };

  return (
    <div className={styles.Container}>
      <div className={styles.Top}>
        <Link
          href={`/category/${currentCategory?.id}/subcategory/${currentSubcategory?.id}/product/${product.id}`}
          name={name}
          className={styles.Title}
        />
        <p className={styles.Price}>
          {price.rangeValue.value * amount} {price.rangeValue.unit}
        </p>
      </div>
      <div className={styles.Body}>
        <div className={styles.Specifications}>
          {product.specifications.map(specification => {
            switch (specification.type) {
              case SpecificationType.Radio:
                return (
                  <p key={specification.id} className={styles.Specification}>
                    {specification.name}: {specification.value.value}
                  </p>
                );
              case SpecificationType.Range:
                return (
                  <p key={specification.id} className={styles.Specification}>
                    {specification.name}: {specification.rangeValue.value} {specification.rangeValue.unit}
                  </p>
                );
              case SpecificationType.Select:
                return (
                  <p key={specification.id} className={styles.Specification}>
                    {specification.name}: {specification.values.map(value => value.value).join(', ')}
                  </p>
                );
              default:
                return null;
            }
          })}
        </div>
        <div className={styles.Actions}>
          <Input
            className={styles.AmountInput}
            type="number"
            name="amount"
            min={1}
            value={amount.toString()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.value && parseInt(e.target.value)) {
                setAmount(parseInt(e.target.value));
              } else {
                setAmount(1);
              }
            }}
          />
          <Button theme={ButtonTheme.Dark} onClick={() => addToCart()} name="Добавить в корзину" />
        </div>
      </div>
    </div>
  );
};
