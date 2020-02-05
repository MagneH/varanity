import React from 'react';
import HamburgerIcon from './hamburger';

interface IconProps {
  symbol: string;
}

export const Icon = (props: IconProps) => {
  switch (props.symbol) {
    case 'hamburger':
      return <HamburgerIcon />;
    default:
      return <span>Unknown icon: {props.symbol}</span>;
  }
};
