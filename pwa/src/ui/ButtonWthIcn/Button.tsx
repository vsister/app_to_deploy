import React, { CSSProperties } from 'react';
import cx from 'classnames';
import { IconName } from '@ui/Icon/icons';
import { Icon } from '@ui/Icon/Icon';
import styles from './ButtonWthIcn.scss';

export enum ButtonThemeIcn {
  Grey = 'grey',
  Bordo = 'bordo',
  White = 'white',
}

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  name?: string;
  className?: string;
  icon: IconName;
  theme: ButtonThemeIcn;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: CSSProperties;
}

const ButtonWthIcon = (props: ButtonProps): React.ReactElement => {
  const { className, name, icon, theme, onClick, style, type } = props;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // e.preventDefault();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={cx(styles.button, className, {
        [styles.button_grey]: theme === ButtonThemeIcn.Grey,
        [styles.button_bordo]: theme === ButtonThemeIcn.Bordo,
        [styles.button_white]: theme === ButtonThemeIcn.White,
      })}
      style={style}
      type={type}
      onClick={handleClick}
    >
      <Icon className={name ? styles.button__icon_withText : styles.button__icon} width={20} height={20} icon={icon} />
      {name && <span className={styles.button__text}>{name}</span>}
    </button>
  );
};

export default ButtonWthIcon;
