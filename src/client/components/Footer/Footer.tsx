import React from 'react';
import { Emoji } from '../Emoji/Emoji';

// Styles
import classes from './Footer.module.scss';

// Exports
export const Footer = () => (
  <footer className={classes.footer}>
    <p className={classes.footerDescription}>
      Made with
      <Emoji value="❤" label="Heart emoji" />
      by <a href="https://github.com/MagneH">Magne</a>
    </p>
    <p className={classes.footerCopyright}>Copyright (c) 2018 - 2021, All rights reserved</p>
  </footer>
);
