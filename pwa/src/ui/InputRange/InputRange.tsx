import * as React from 'react';
import cx from 'classnames';
import c from './InputRange.scss';

interface InputRangeProps {
  text: string;
  name: string;
  placeholder: string;
  type: string;
  value?: any;
  className?: string;
  [key: string]: any;
}

const InputRange: React.FC<InputRangeProps> = props => {
  const { text, name, placeholder, type, value, className, ...rest } = props;

  return (
    <div className={cx(c.input, c.input_s, c.input_theme, className)}>
      <div className={c.input__text}>{text}</div>
      <input
        value={value}
        type={type}
        className={c.input__num + ' ' + c.input__num_s}
        name={name}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
};

export default InputRange;
