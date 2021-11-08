import { Find } from '@components/Find/Find';
import { IconName } from '@ui/Icon/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Button, { ButtonTheme } from '../../ui/Button/Button';
import ButtonWthIcon, { ButtonThemeIcn } from '../../ui/ButtonWthIcn/Button';
import Title from '../../ui/Title/Title';
import styles from './Header.scss';

export interface HeaderProps {
  isInteractive?: boolean;
}

export const Header = (props: HeaderProps): React.ReactElement => {
  const { isInteractive } = props;
  const history = useHistory();

  return (
    <div className={styles.header__container}>
      <div className={styles.Title}>
        <Title />
      </div>
      {isInteractive && (
        <>
          <Button
            onClick={() => history.push('/')}
            className={styles.Button}
            name="Каталог"
            theme={ButtonTheme.Bordo}
          />
          <div className={styles.Find}>
            <Find />
          </div>
          <ButtonWthIcon
            onClick={() => history.push('/cart')}
            className={styles.Purchase + ' ' + styles.Icon_size}
            theme={ButtonThemeIcn.White}
            icon={IconName.NewPurchase}
          />
          <ButtonWthIcon
            onClick={() => history.push('/user')}
            className={styles.Account + ' ' + styles.Icon_size}
            theme={ButtonThemeIcn.White}
            icon={IconName.Person}
          />
        </>
      )}
    </div>
  );
};
