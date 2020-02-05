import React from 'react';
import { Header, HeaderProps } from '../../../components/Header/Header';
import { TerminalProps } from '../../../components/Terminal/Terminal';

// Styles
import classes from './TerminalHeader.module.scss';

// Types
type TerminalHeaderProps = HeaderProps & TerminalProps;

// Exports
export const TerminalHeader = ({ title, subtitle, description }: TerminalHeaderProps) => (
  <Header
    title={title}
    subtitle={subtitle}
    description={description}
    className={classes.terminalHeader}
  />
);
