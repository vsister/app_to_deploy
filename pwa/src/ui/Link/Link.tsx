import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import cx from 'classnames';
import c from './Link.scss';

interface LinkProps {
  name: string;
  href?: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export const Link: React.FC<LinkProps> = props => {
  const { name, href, onClick, className: classNameFromProps, style } = props;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick(e);
    }
  };

  const className = cx(c.link, c.link_theme_blackRed, c.link__text_l, c.link_m, classNameFromProps);

  return !href ? (
    <a style={style} className={className} type="link" onClick={handleClick}>
      {name}
    </a>
  ) : (
    <RouterLink style={style} type="link" to={href} onClick={onClick} className={className}>
      {name}
    </RouterLink>
  );
};
