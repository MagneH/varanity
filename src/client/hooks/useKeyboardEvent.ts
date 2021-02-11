import { useEffect } from 'react';

export const useKeyboardEvent = (key: string, callback: () => any): void => {
  useEffect((): (() => void) => {
    if (typeof window !== 'undefined') {
      const handler = (event: KeyboardEvent): void => {
        if (event.key === key) {
          callback();
        }
      };
      window.addEventListener('keydown', handler);
      return (): void => {
        window.removeEventListener('keydown', handler);
      };
    }
    return (): void => {};
  }, [callback, key]);
};
