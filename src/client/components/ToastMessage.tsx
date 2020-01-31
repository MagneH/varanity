import React from 'react';

interface MsgProps {
  switchToDraft: Function;
  closeToast: Function;
}

const ToastMessage = ({ closeToast, switchToDraft }: MsgProps) => (
  <div>
    This article is being edited in Varanity Studio
    <button
      className="toast-message__button"
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
