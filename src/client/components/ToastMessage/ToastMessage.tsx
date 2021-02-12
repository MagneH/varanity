import React from 'react';
import classes from './ToastMessage.module.scss';

interface MsgProps {
  switchToDraft: () => any;
  closeToast: () => any;
}

const ToastMessage = ({ closeToast, switchToDraft }: MsgProps) => (
  <div>
    🖋 This article is being edited in Varanity Studio
    <button
      className={classes.gradientBorder}
      type="button"
      onClick={() => {
        switchToDraft();
        closeToast();
      }}
    >
      Switch to the new draft
    </button>
  </div>
);

export { ToastMessage };
