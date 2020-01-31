import React, { useEffect } from 'react';
import Helmet from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import url from 'url';
import { SanityDocument } from '@sanity/client';
import { PageComponent } from '../components/Page/Page';
import { usePreview } from '../hooks/usePreview';
import { RootState } from '../redux';

import { actionCreators as previewActions } from '../redux/modules/previews';
import { actionCreators as documentActions } from '../redux/modules/documents';
import { Header } from '../components/Header/Header';
import { Main } from '../components/Main/Main';

// Types
export interface PageProps {
  isPreview?: boolean;
  isDraft?: boolean;
  location: Location;
  history: History;
  match: any;
  language: string;
  slug: string;
}

export interface PageModel extends SanityDocument {
  title: string;
}

export const Page = ({ isPreview, location, history, match, slug }: PageProps) => {
  const page = useSelector<RootState, PageModel>(state => {
    if (isPreview) {
      const { query } = url.parse(location.search, true);
      const id = query.isDraft == 'true' ? `drafts.${match.params.id}` : `${match.params.id}`;
      return state.previews.data[id];
    }
    return state.documents.data[slug];
  });

  if (isPreview) {
    const { query } = url.parse(location.search, true);
    const id = query.isDraft == 'true' ? `drafts.${match.params.id}` : `${match.params.id}`;
    usePreview(location, history, id, previewActions.setOne);
  }

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isPreview) {
      if (!page) {
        dispatch(documentActions.getOne(slug));
      }
    }
  }, [location]);

  return page ? (
    <>
      <Helmet>
        <title itemProp="name" lang="en">
          Welcome to Varanity
        </title>
      </Helmet>
      <Header title="Hello World" subtitle="show me — don't tell me" />
      <Main>
        <PageComponent page={page} />
      </Main>
    </>
  ) : (
    <div>Loading</div>
  );
};
