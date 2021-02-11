import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SanityDocument } from '@sanity/client';
import { ClientSanityClient } from '../services/SanityService';

const useSanityPreview = (
  id: string,
  cb: (newVersion: SanityDocument) => any,
  isViewingDraft: boolean,
  toastEdit: () => any,
  toastPublish: () => any,
): void => {
  let draftId: string;
  let publishedId: string;
  if (id.includes('drafts')) {
    draftId = id;
    // eslint-disable-next-line prefer-destructuring
    publishedId = id.split('drafts.')[1];
  } else {
    draftId = `drafts.${id}`;
    publishedId = id;
  }

  const dispatch = useDispatch();

  useEffect(() => {
    const query = `
      *[_id == $id][0]
    `;
    // Listen for changes to the drafts of the published article or to the draft itself

    const draftParams = {
      // eslint-disable-next-line no-underscore-dangle
      id: draftId,
    };

    const draftSub = ClientSanityClient.listen(query, draftParams).subscribe(({ result }) => {
      if (result) {
        dispatch(cb(result));
        toastEdit();
      }
    });

    const publishParams = {
      // eslint-disable-next-line no-underscore-dangle
      id: publishedId,
    };

    const publishSub = ClientSanityClient.listen(query, publishParams).subscribe(({ result }) => {
      if (result) {
        dispatch(cb(result));
        toastPublish();
      }
    });

    return () => {
      if (draftSub) draftSub.unsubscribe();
      if (publishSub) publishSub.unsubscribe();
    };
  }, []);
};
export { useSanityPreview };
