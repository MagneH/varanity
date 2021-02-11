import { RefObject, useEffect } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 */
const useOutsideAlerter = (
  ref: RefObject<HTMLDivElement>,
  isEnabled: boolean,
  cb: () => any,
  exceptionRefs: RefObject<HTMLDivElement>[],
): void => {
  /**
   * Alert if clicked on outside of element
   */
  const handleClickOutside = (event: any) => {
    let exception = false;
    if (exceptionRefs) {
      exception = exceptionRefs.some(
        (exceptionRef: RefObject<HTMLDivElement>) =>
          exceptionRef.current && exceptionRef.current.contains(event.target),
      );
    }
    if (ref.current && !ref.current.contains(event.target) && !exception && isEnabled) {
      // alert('You clicked outside of me!');
      cb();
    }
  };

  useEffect(() => {
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
};

export default useOutsideAlerter;
