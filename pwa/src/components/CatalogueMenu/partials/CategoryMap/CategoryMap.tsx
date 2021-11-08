import React from 'react';
import { Category } from '../Category/Category';
import styles from './CategoryMap.scss';
import { ICategoryGroup } from 'shared/entities/Category';
import { useDispatch, useSelector } from 'react-redux';
import { UserRole } from 'shared/entities/User';
import { RootState } from '@store';
import Button, { ButtonTheme } from '@ui/Button/Button';
import { useHistory } from 'react-router-dom';
import { deleteGroup } from '@store/thunks/catalogue';

export interface CategoryMapProps {
  group: ICategoryGroup;
}

export const CategoryMap: React.FC<CategoryMapProps> = ({ group }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { role } = useSelector((state: RootState) => state.user.data);
  const { currentGroup } = useSelector((state: RootState) => state.catalogue);

  const handleDeleteGroup = () => {
    if (
      currentGroup &&
      window.confirm(
        'Удаление группы подвлечет за собой удаление всех ее категорий. Вы уверены, что хотите удалить группу?'
      )
    ) {
      dispatch(deleteGroup(currentGroup.id));
    }
  };

  return (
    <div className={styles.CategoryMap}>
      <div className={styles.CategoryMap__top}>
        <div className={styles.CategoryMap__title}>{group.name}</div>
        {role === UserRole.Editor && (
          <>
            <Button
              onClick={() => {
                if (currentGroup) {
                  history.push(`/group/${currentGroup.id}/edit`);
                }
              }}
              className={styles.CategoryMap__action}
              theme={ButtonTheme.Light}
              name="Править группу"
            />
            <Button
              onClick={() => {
                handleDeleteGroup();
              }}
              className={styles.CategoryMap__action}
              theme={ButtonTheme.Light}
              name="Удалить группу"
            />
            <Button
              onClick={() => {
                if (currentGroup) {
                  history.push(`/group/${currentGroup.id}/category/create`);
                }
              }}
              className={styles.CategoryMap__action}
              theme={ButtonTheme.Dark}
              name="Создать категорию"
            />
          </>
        )}
      </div>
      {group.categories.map((category, index) => (
        <Category groupId={group.id} key={category.name + index} {...category} />
      ))}
    </div>
  );
};
