import url from 'url';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import querystring from 'querystring';
import cloneDeep from 'lodash/cloneDeep';
import { RouteComponentProps } from 'react-router';
import { PayloadActionCreator } from 'typesafe-actions';
import { useSanityPreview } from './useSanityPreview';
import { ToastMessage } from '../components/ToastMessage/ToastMessage';

const usePreview = (
  location: Location,
  history: RouteComponentProps['history'],
  id: string,
  updateState: PayloadActionCreator<any, any>,
) => {
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

  const notifyOfEditing = () =>
    toast(
      () => (
        <ToastMessage
          switchToDraft={() => {
            setIsViewingDraft(true);
            const parsed = querystring.parse(location.search.split('?')[1]);
            parsed.isDraft = 'true';
            const newLocation = cloneDeep(location);
            newLocation.search = querystring.stringify(parsed);
            setShouldToastEdits(false);
            history.push(newLocation);
          }}
          closeToast={() => {
            setShouldToastEdits(true);
          }}
        />
      ),
      {
        position: 'top-right',
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      },
    );

  useEffect(() => {
    if (!isViewingDraft && shouldToastEdits) {
      notifyOfEditing();
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
