import React from 'react';
import classNames from 'classnames';

// Animations
import installSrcMp4 from './assets/install.mp4';
import installSrcWebm from './assets/install.webm';
import installSrcCaptions from './assets/install.vtt';

// Styles
import classes from './Terminal.module.scss';

// Init
const terminalAnimations = {
  install: {
    mp4: installSrcMp4,
    webm: installSrcWebm,
    label: 'Installing varan through terminal',
    captions: installSrcCaptions,
  },
};

// Types
export type TerminalAnimation = keyof typeof terminalAnimations;
export interface TerminalProps {}

// Exports
export const Terminal = () => (
  <div className={classes.terminal}>
    <div className={classes.terminalTopBar}>
      <span
        className={classNames(classes.terminalTopBarButton, classes.terminalTopBarButtonClose)}
      />
      <span
        className={classNames(classes.terminalTopBarButton, classes.terminalTopBarButtonMinimize)}
      />
      <span
        className={classNames(classes.terminalTopBarButton, classes.terminalTopBarButtonMaximize)}
      />
    </div>
  </div>
);
