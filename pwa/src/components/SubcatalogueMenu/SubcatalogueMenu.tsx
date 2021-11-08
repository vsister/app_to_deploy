import Button, { ButtonTheme } from '@ui/Button/Button';
import React from 'react';
import { Category } from '@components/CatalogueMenu/partials/Category/Category';
import { Breadcrumbs } from '@components/Breadcrumbs/Breadcrumbs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store';
import styles from './SubcatalogueMenu.scss';
import { useHistory } from 'react-router-dom';
import { deleteCategory } from '@store/thunks/catalogue';
import { UserRole } from 'shared/entities/User';

export const SubcatalogueMenu: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { currentGroup, currentCategory } = useSelector((state: RootState) => state.catalogue);
  const { role } = useSelector((state: RootState) => state.user.data);

  const handleDeleteCategory = () => {
    if (
      currentCategory &&
      window.confirm(
        'Удаление категории подвлечет за собой удаление всех ее подкатегорий и товаров. Вы уверены, что хотите удалить категорию?'
      )
    ) {
      dispatch(deleteCategory(currentCategory.id));
    }
  };

  return (
    <div>
      <div className={styles.Subcatalogue__meta}>
        <Breadcrumbs />
        <div className={styles.SubcatalogueButtons}>
          {role === UserRole.Editor && (
            <>
              <Button
                onClick={() => {
                  if (currentGroup && currentCategory) {
                    history.push(`/group/${currentGroup.id}/category/${currentCategory.id}/edit`);
                  }
                }}
                className={styles.SubcatalogueButtons__button}
                theme={ButtonTheme.Light}
                name="Править категорию"
              />
              <Button
                onClick={handleDeleteCategory}
                className={styles.SubcatalogueButtons__button}
                theme={ButtonTheme.Light}
                name="Удалить категорию"
              />
              <Button
                onClick={() => {
                  if (currentGroup && currentCategory) {
                    history.push(`/group/${currentGroup.id}/category/${currentCategory.id}/subcategory/create`);
                  }
                }}
                className={styles.SubcatalogueButtons__button}
                theme={ButtonTheme.Dark}
                name="Создать подкатегорию"
              />
            </>
          )}
        </div>
      </div>
      {currentCategory && <Category {...currentCategory} />}
    </div>
  );
};
