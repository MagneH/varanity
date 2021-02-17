import React, { ReactNode } from 'react';
import { ThemeProvider as StyledProvider } from 'styled-components';
import { themeDefault } from '../Theme/themeDefault';

interface Props {
  children: ReactNode;
  theme?: typeof themeDefault;
}

// Replace the values in defaultTheme with the same keys in the theme being passed
export const ThemeProvider = ({ children, theme }: Props) => (
  <StyledProvider theme={theme}>{children}</StyledProvider>
);

export default ThemeProvider;
