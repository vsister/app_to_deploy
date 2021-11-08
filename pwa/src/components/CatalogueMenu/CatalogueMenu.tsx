import React from 'react';
import Button, { ButtonTheme } from '@ui/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { LoadingStatus } from '@store/slices/user';
import { getCatalogue } from '@store/thunks/catalogue';
import { catalogueSlice } from '@store/slices/catalogue';
import { useCatalogue } from '@hooks/useCatalogue';
import { CategoryMap } from './partials/CategoryMap/CategoryMap';
import { Sidebar } from './partials/Sidebar/Sidebar';
import styles from './CatalogueMenu.scss';
import { UserRole } from 'shared/entities/User';
import { ICategoryGroup } from 'shared/entities/Category';
import { useHistory } from 'react-router-dom';

export const CatalogueMenu: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, groups, currentGroup, error } = useSelector((state: RootState) => state.catalogue);
  const { role } = useSelector((state: RootState) => state.user.data);

  const setCurrentGroup = (group: ICategoryGroup): void => {
    dispatch(catalogueSlice.actions.setCurrentGroup(group));
  };

  if (loading !== LoadingStatus.Complete) {
    return null;
  }

  return (
    <>
      {role === UserRole.Editor && (
        <div className={styles.CatalogueButtons}>
          <Button
            onClick={() => {
              history.push('/group/create');
            }}
            className={styles.CatalogueButtons__button}
            theme={ButtonTheme.Dark}
            name="Создать группу категорий"
          />
        </div>
      )}
      <div className={styles.CatalogueMenu}>
        <Sidebar topLevelCategories={groups} onCategoryChange={setCurrentGroup} selectedCategory={currentGroup} />
        {currentGroup && <CategoryMap group={currentGroup} />}
      </div>
    </>
  );
};
