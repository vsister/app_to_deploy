import { RootState } from '@store';
import React from 'react';
import { useSelector } from 'react-redux';
import { UserRole } from 'shared/entities/User';
import styles from './UserData.scss';

export const UserData: React.FC = () => {
  const { name, role } = useSelector((state: RootState) => state.user.data);

  if (!name && !role) {
    return null;
  }

  const renderRole = (): string => {
    switch (role) {
      case UserRole.Admin:
        return 'Администратор';
      case UserRole.Editor:
        return 'Редактор';
      case UserRole.Expert:
        return 'Эксперт';
      case UserRole.Purchaser:
        return 'Покупатель';
      default:
        return '';
    }
  };

  return (
    <>
      <h1 className={styles.Username}>{name}</h1>
      <h4 className={styles.Role__label}>
        Уровень доступа: <span className={styles.Role}>{renderRole()}</span>
      </h4>
    </>
  );
};
