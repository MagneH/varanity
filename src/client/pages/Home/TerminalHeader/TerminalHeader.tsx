import React from 'react';
import { Header, HeaderProps } from '../../../components/Header/Header';

// Styles
import classes from './TerminalHeader.module.scss';

// Types
type TerminalHeaderProps = HeaderProps;

// Exports
export const TerminalHeader = ({ title, subtitle, description }: TerminalHeaderProps) => (
  <Header
    title={title}
    subtitle={subtitle}
    description={description}
    className={classes.terminalHeader}
  />
);
