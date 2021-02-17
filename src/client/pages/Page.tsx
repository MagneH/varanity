import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { useDispatch } from 'react-redux';
import { SanityDocument } from '@sanity/client';
import { RouteComponentProps } from 'react-router';
import qs from 'qs';
import { PageComponent } from '../components/Page/Page';
import { usePreview } from '../hooks/usePreview';

import { actionCreators as previewActions } from '../redux/modules/previews';
import { actions as documentActions } from '../redux/modules/documents';
import { Main } from '../components/Main/Main';
import useSelector from '../redux/typedHooks';
import { NotFound } from './errors/NotFound/NotFound';

// Types
export interface PageProps {
  isPreview?: boolean;
  isDraft?: boolean;
  location: Location;
  history: RouteComponentProps['history'];
  match: any;
  language: string;
  slug: string;
}

export interface PageModel extends SanityDocument {
  title: string;
  _createdAt: string;
}

export const Page = ({ isPreview, location, history, match, slug }: PageProps) => {
  const [didFetch, setDidFetch] = useState(false);
  const isLoading = useSelector((state) => state.documents.isLoading);

  const query = qs.parse(location.search, { ignoreQueryPrefix: true });

  const page = useSelector((state) => {
    if (isPreview) {
      const id = query.isDraft === 'true' ? `drafts.${match.params.id}` : `${match.params.id}`;
      return state.previews.data[id];
    }
    return state.documents.data[slug];
  });

  if (isPreview) {
    const id = query.isDraft === 'true' ? `drafts.${match.params.id}` : `${match.params.id}`;
    usePreview(location, history, id, previewActions.setOne);
  }

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isPreview) {
      if (!page) {
        setDidFetch(true);
        dispatch(documentActions.getOne.request(slug));
      }
    }
  }, [location]);

  if (didFetch && !isLoading && !page) {
    return <NotFound />;
  }

  return page ? (
    <>
      <Helmet>
        <title itemProp="name" lang="en">
          Welcome to Varanity
        </title>
      </Helmet>
      <Main>
        <PageComponent page={page} />
      </Main>
    </>
  ) : (
    <div>Loading Page</div>
  );
};
