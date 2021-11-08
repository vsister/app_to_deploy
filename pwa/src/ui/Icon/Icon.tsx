import React from 'react';
import { IconName, icons } from './icons';

export interface IconProps {
  icon: IconName;
  width: number;
  height: number;
  className?: string;
}

export const Icon = (props: IconProps): React.ReactElement => {
  const { icon, className, width, height } = props;
  const iconData = icons[icon];

  return (
    <svg className={className} viewBox={iconData.viewBox}>
      {iconData.vector}
    </svg>
  );
};
