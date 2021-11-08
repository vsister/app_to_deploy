import * as React from 'react';
import cx from 'classnames';
import styles from './Button.scss';

export enum ButtonTheme {
  Light = 'light',
  Dark = 'dark',
  Bordo = 'bordo',
}

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  name: string;
  className?: string;
  theme: ButtonTheme;
  onClick?: (e: React.MouseEvent) => void;
}

const Button = (props: ButtonProps): React.ReactElement => {
  const { className, name, theme, onClick, type } = props;

  return (
    <button
      onClick={onClick}
      type={type}
      className={cx(styles.button, className, {
        [styles.button_light]: theme === ButtonTheme.Light,
        [styles.button_dark]: theme === ButtonTheme.Dark,
        [styles.button_bordo]: theme === ButtonTheme.Bordo,
      })}
    >
      {name}
    </button>
  );
};

export default Button;
