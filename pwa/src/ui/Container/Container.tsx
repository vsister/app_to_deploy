import React, { Children } from 'react';
import styles from './Container.scss';

interface ContainerProps {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = (props: ContainerProps) => {
  const { children } = props;
  return <div className={styles.Container}>{children}</div>;
};
