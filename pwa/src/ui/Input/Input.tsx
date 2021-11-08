import * as React from 'react';
import cx from 'classnames';
import c from './Input.scss';
import { ObjectSchema } from 'yup';

export enum InputTheme {
  Light = 'light',
  Dark = 'dark',
}

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  name: string;
  type: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  theme?: InputTheme;
  error?: string;
}

export const Input = (props: InputProps): React.ReactElement => {
  const {
    placeholder,
    name,
    disabled,
    value,
    type,
    onChange,
    className,
    theme = InputTheme.Light,
    error,
    ...rest
  } = props;

  return (
    <>
      <div className={c.container}>
        <input
          disabled={disabled}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className={cx(className, c.input, {
            [c.input_light]: theme === InputTheme.Light,
            [c.input_dark]: theme === InputTheme.Dark,
          })}
          placeholder={placeholder}
          {...rest}
        />
        {error && <p className={c.input__error}>{error}</p>}
      </div>
    </>
  );
};
