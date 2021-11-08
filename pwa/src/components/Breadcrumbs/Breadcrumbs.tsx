import { RootState } from '@store';
import { IBreadcrumb } from '@store/slices/breadcrumbs';
import { Link } from '@ui/Link/Link';
import React from 'react';
import { useSelector } from 'react-redux';
import styles from './Breadcrumbs.scss';

const Breadcrumb: React.FC<IBreadcrumb> = props => (
  <span>
    <Link className={styles.Breadcrumb} href={props.href} name={props.name} />
  </span>
);
const BreadcrumbSeparator: React.FC<{ separator: string }> = props => (
  <span className={styles.Separator}>{props.separator}</span>
);

export interface BreadcrumbsProps {
  separator?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ separator }): React.ReactElement => {
  const { path } = useSelector((state: RootState) => state.breadcrumbs);

  return (
    <div className={styles.Container}>
      {path.map((pathItem, index) => (
        <React.Fragment key={pathItem.name}>
          <Breadcrumb {...pathItem} />
          {index < path.length - 1 && <BreadcrumbSeparator separator={separator ? separator : ' > '} />}
        </React.Fragment>
      ))}
    </div>
  );
};
