import React from 'react';
import { Link } from '@ui/Link/Link';
import { useHistory } from 'react-router-dom';
import styles from './Category.scss';
import { IParentCategory, ISubcategory, CategoryType } from 'shared/entities/Category';

export type CategoryProps = IParentCategory | (ISubcategory & { parentId: string });

export const Category: React.FC<CategoryProps> = props => {
  const history = useHistory();

  return (
    <div className={`${styles.Category} ${props.type === CategoryType.Parent ? styles.isTopLevel : ''}`}>
      <Link
        name={props.name}
        onClick={() =>
          props.type === CategoryType.Parent
            ? history.push(`/category/${props.id}`)
            : history.push(`/category/${props.parentId}/subcategory/${props.id}`)
        }
        className={`${styles.Category__name} ${props.type === CategoryType.Parent ? styles.isTopLevel : ''}`}
      />
      {props.type === CategoryType.Parent &&
        props.subcategories.map((item, index) => <Category key={item.name + index} parentId={props.id} {...item} />)}
    </div>
  );
};
