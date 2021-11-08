import { Breadcrumbs } from '@components/Breadcrumbs/Breadcrumbs';
import { Footer } from '@components/Footer/Footer';
import { Header } from '@components/Header/Header';
import { RootState } from '@store';
import { LoadingStatus } from '@store/slices/user';
import { getProduct } from '@store/thunks/product';
import Button, { ButtonTheme } from '@ui/Button/Button';
import { Container } from '@ui/Container/Container';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory, useLocation, useParams } from 'react-router-dom';
import { Input } from '@ui/Input/Input';
import { cartSlice } from '@store/slices/cart';
import { breadcrumbsSlice } from '@store/slices/breadcrumbs';
import styles from './ProductPage.scss';
import { IProductSpecification, SpecificationType } from 'shared/entities/Specification';
import { catalogueSlice } from '@store/slices/catalogue';
import { getCatalogue } from '@store/thunks/catalogue';

const Specification: React.FC<{ specification: IProductSpecification }> = props => {
  const { specification } = props;

  const getSpecificationValue = (): string => {
    switch (specification.type) {
      case SpecificationType.Radio:
        return `${specification.value.value}`;
      case SpecificationType.Range:
        return `${specification.rangeValue.value} ${specification.rangeValue.unit}`;
      case SpecificationType.Select:
        return `${specification.values.map(value => value.value).join(', ')}`;
      default:
        return '';
    }
  };

  return (
    <div key={specification.id} className={styles.Specifications__row}>
      <h6 className={styles.Specifications__key}>{specification.name}:</h6>
      <p className={styles.Specifications__value}>{getSpecificationValue()}</p>
    </div>
  );
};

export const ProductPage: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { product, loading } = useSelector((state: RootState) => state.product);
  const { role } = useSelector((state: RootState) => state.user.data);
  const { groups, currentGroup, currentCategory, currentSubcategory, loading: loadingCatalogue } = useSelector(
    (state: RootState) => state.catalogue
  );
  const { productId, categoryId, subcategoryId } = useParams<{
    productId: string;
    categoryId: string;
    subcategoryId: string;
  }>();

  const [amount, setAmount] = React.useState(1);

  React.useEffect(() => {
    if (!groups.length && loadingCatalogue === LoadingStatus.Initial) {
      dispatch(getCatalogue());
    }

    if (!currentGroup && groups.length) {
      const groupContainingCategory = groups.find(group =>
        group.categories.find(category => category.id === categoryId)
      );

      if (groupContainingCategory) {
        dispatch(catalogueSlice.actions.setCurrentGroup(groupContainingCategory));
      } else {
        history.push('/');
      }
    }

    if (currentGroup && !currentCategory) {
      const categoryContainingSubcategory = currentGroup.categories.find(category => category.id === categoryId);

      if (categoryContainingSubcategory) {
        dispatch(catalogueSlice.actions.setCurrentCategory(categoryContainingSubcategory));
      } else {
        history.push('/');
      }
    }

    if (currentGroup && currentCategory) {
      const currentSubcategory = currentCategory.subcategories.find(subcategory => subcategory.id === subcategoryId);

      if (currentSubcategory) {
        dispatch(catalogueSlice.actions.setCurrentSubcategory(currentSubcategory));
      } else {
        history.push('/');
      }
    }
  }, [groups, currentGroup, currentCategory]);

  React.useEffect(() => {
    dispatch(getProduct(productId));
  }, []);

  React.useEffect(() => {
    if (product) {
      dispatch(
        breadcrumbsSlice.actions.setBreadcrumbs([
          {
            name: product.breadcrumbs[2].name,
            href: `/category/${breadcrumbs[1].id}/subcategory/${breadcrumbs[2].id}`,
          },
          { name: product.name, href: `/product/${product.id}` },
        ])
      );
    }
  }, [product]);

  if (!product) {
    return null;
  }

  if (!product && loading === LoadingStatus.Complete) {
    return <Redirect to="/" />;
  }

  const addToCart = () => {
    dispatch(cartSlice.actions.addToCart({ product, quantity: amount }));
  };

  const { breadcrumbs, name, specifications, price, isVerified } = product;

  return (
    <>
      <Header isInteractive />
      <Container>
        <div className={styles.Meta}>
          <Breadcrumbs />
          <Button
            onClick={() => {
              if (currentCategory && currentSubcategory) {
                history.push(
                  `/category/${currentCategory.id}/subcategory/${currentSubcategory.id}/product/${product.id}/edit`
                );
              }
            }}
            theme={ButtonTheme.Light}
            name="Править"
          />
        </div>
        <section className={styles.Sections}>
          <div className={styles.LeftSection}>
            <h1 className={styles.Title}>{name}</h1>
            {/* TODO: add verificated guy here */}
            <h2 className={styles.Specifications__title}>Технические характеристики</h2>
            <div className={styles.Specifications__table}>
              {specifications.map(specification => (
                <Specification specification={specification} />
              ))}
            </div>
          </div>
          <div className={styles.RightSection}>
            <div className={styles.RightSection__row}>
              <h6 className={styles.RightSection__row_key}>{product.price.name}:</h6>
              <p className={styles.RightSection__row_value}>
                {product.price.rangeValue.value * amount} {product.price.rangeValue.unit}
              </p>
            </div>
            <div className={styles.RightSection__row}>
              <h6 className={styles.RightSection__row_key}>Количество:</h6>
              <div className={styles.RightSection__row_value}>
                <Input
                  className={styles.Amount}
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
              </div>
            </div>

            <Button onClick={addToCart} theme={ButtonTheme.Dark} name="Добавить в корзину" />
          </div>
        </section>
      </Container>
      <Footer />
    </>
  );
};
