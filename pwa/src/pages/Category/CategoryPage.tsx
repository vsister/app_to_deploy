import React, { useEffect } from 'react';
import { Breadcrumbs } from '@components/Breadcrumbs/Breadcrumbs';
import { Filters } from '@components/Filters/Filters';
import { Footer } from '@components/Footer/Footer';
import { Header } from '@components/Header/Header';
import { Container } from '@ui/Container/Container';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store';
import { Product } from '@components/Product/Product';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { categorySlice } from '@store/slices/category';
import { getProducts } from '@store/thunks/category';
import { catalogueSlice } from '@store/slices/catalogue';
import { breadcrumbsSlice } from '@store/slices/breadcrumbs';
import { LoadingStatus } from '@store/slices/user';
import { deleteSubcategory, getCatalogue } from '@store/thunks/catalogue';
import { UserRole } from 'shared/entities/User';
import styles from './CategoryPage.scss';
import Button, { ButtonTheme } from '@ui/Button/Button';

export const CategoryPage: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { groups, currentGroup, currentCategory, currentSubcategory } = useSelector(
    (state: RootState) => state.catalogue
  );
  const { products, loading, filters, inPage, page } = useSelector((state: RootState) => state.category);
  const { role } = useSelector((state: RootState) => state.user.data);
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
  const { search, pathname } = useLocation();

  useEffect(() => {
    if (!groups.length && loading === LoadingStatus.Initial) {
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
        dispatch(
          breadcrumbsSlice.actions.setBreadcrumbs([
            {
              name: currentGroup.name,
              href: '/',
            },
            {
              name: currentCategory.name,
              href: `/category/${currentCategory.id}`,
            },
            {
              name: currentSubcategory.name,
              href: `/category/${currentCategory.id}/subcategory/${currentSubcategory.id}`,
            },
          ])
        );
        dispatch(catalogueSlice.actions.setCurrentSubcategory(currentSubcategory));
      } else {
        history.push('/');
      }
    }
  }, [groups, currentGroup, currentCategory]);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const urlPage = params.get('page') || null;
    const urlInPage = params.get('inPage') || null;
    const urlFilters = params.get('filters') || null;

    if (urlPage) {
      dispatch(categorySlice.actions.setPage(urlPage));
    }

    if (urlInPage) {
      dispatch(categorySlice.actions.setInPage(urlInPage));
    }

    if (urlFilters) {
      dispatch(categorySlice.actions.setFilters(JSON.parse(decodeURIComponent(urlFilters))));
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(search);

    if (page) {
      params.set('page', page.toString());
    }

    if (filters?.price || filters?.specifications?.length) {
      params.set('filters', encodeURIComponent(JSON.stringify(filters)));
    } else {
      params.delete('filters');
    }

    if (currentCategory) {
      dispatch(
        getProducts({
          subcategoryId,
          categoryId: currentCategory.id,
          params: {
            page,
            inPage,
            filters,
          },
        })
      );
    }

    if (params.toString() !== new URLSearchParams(search).toString()) {
      history.push({
        pathname,
        search: params.toString(),
      });
    }
  }, [currentCategory, page, inPage, filters]);

  const handleDeleteSubcategory = () => {
    if (
      window.confirm(
        'Удаление подкатегории повлечет за собой удаление всех ее товаров. Вы уверены, что хотите удалить подкатегорию?'
      )
    ) {
      if (currentSubcategory) {
        dispatch(deleteSubcategory(currentSubcategory.id));
      }
    }
  };

  return (
    <>
      <Header isInteractive />
      <Container>
        <div className={styles.Breadcrumbs}>
          <Breadcrumbs />
        </div>
        <div className={styles.Actions}>
          {role === UserRole.Editor && (
            <>
              <Button
                onClick={() => {
                  if (currentGroup && currentCategory && currentSubcategory) {
                    history.push(
                      `/group/${currentGroup.id}/category/${currentCategory.id}/subcategory/${currentSubcategory.id}/edit`
                    );
                  }
                }}
                className={styles.Category__action}
                theme={ButtonTheme.Light}
                name="Править подкатегорию"
              />
              <Button
                onClick={handleDeleteSubcategory}
                className={styles.Category__action}
                theme={ButtonTheme.Light}
                name="Удалить подкатегорию"
              />
              <Button
                onClick={() => {
                  if (currentGroup && currentCategory && currentSubcategory) {
                    history.push(`/category/${currentCategory.id}/subcategory/${currentSubcategory.id}/product/create`);
                  }
                }}
                className={styles.Category__action}
                theme={ButtonTheme.Dark}
                name="Добавить позицию"
              />
            </>
          )}
        </div>
        <div className={styles.Main}>
          <Filters />
          <div className={styles.Products__container}>
            {products.map(product => (
              <Product key={product.id} product={product} />
            ))}
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};
