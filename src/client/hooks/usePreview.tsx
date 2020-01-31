import url from 'url';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import querystring from 'querystring';
import cloneDeep from 'lodash/cloneDeep';
import { useSanityPreview } from './useSanityPreview';
import { ToastMessage } from '../components/ToastMessage';

const usePreview = (location: Location, history: History, id: string, updateState: Function) => {
  const { isDraft } = url.parse(location.search, true).query;
  const [isViewingDraft, setIsViewingDraft] = useState(isDraft === 'true');
  const [shouldToastEdits, setShouldToastEdits] = useState(false);
  const [shouldToastPublish, setShouldToastPublish] = useState(false);
  // eslint-disable-next-line no-underscore-dangle
  useSanityPreview(
    id,
    updateState,
    isViewingDraft,
    () => {
      setShouldToastEdits(true);
    },
    () => {
      setShouldToastPublish(true);
    },
  );

  useEffect(() => {
    if (!isViewingDraft && shouldToastEdits) {
      if (!toast.isActive('edit-toast')) {
        toast(
          ({ closeToast }: { closeToast: () => {} }) => {
            return (
              <ToastMessage
                switchToDraft={() => {
                  setIsViewingDraft(true);
                  const parsed = querystring.parse(location.search.split('?')[1]);
                  parsed.isDraft = 'true';
                  const newLocation = cloneDeep(location);
                  newLocation.search = querystring.stringify(parsed);
                  history.push(newLocation);
                }}
                closeToast={() => {
                  setShouldToastEdits(true);
                  closeToast();
                }}
              />
            );
          },
          { autoClose: false, toastId: 'edit-toast' },
        );
      }
      setShouldToastEdits(false);
    }
  }, [shouldToastEdits]);

  useEffect(() => {
    if (shouldToastPublish) {
      const parsed = querystring.parse(location.search.split('?')[1]);
      parsed.isDraft = 'false';
      const newLocation = cloneDeep(location);
      newLocation.search = querystring.stringify(parsed);
      history.push(newLocation);
      if (!toast.isActive('publish-toast')) {
        toast.success('The article was published', { toastId: 'publish-toast' });
        setShouldToastPublish(false);
      }
    }
  }, [shouldToastPublish]);
};

export { usePreview };
