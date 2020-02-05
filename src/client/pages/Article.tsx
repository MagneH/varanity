import React, { useEffect } from 'react';
import Helmet from 'react-helmet';
import { SanityBlock, SanityDocument } from '@sanity/client';
import { useDispatch, useSelector } from 'react-redux';
import url from 'url';
import { usePreview } from '../hooks/usePreview';
import { ArticleComponent } from '../components/Article/Article';
import { RootState } from '../redux';

import { actionCreators as previewActions } from '../redux/modules/previews';
import { actionCreators as documentActions } from '../redux/modules/documents';
import { Header } from '../components/Header/Header';
import { Main } from '../components/Main/Main';
import { AuthorModel } from '../redux/modules/authors';

// Types
export interface ArticleProps {
  isPreview?: boolean;
  isDraft?: boolean;
  location: Location;
  history: History;
  match: any;
  language: string;
  slug: string;
}

export interface ArticleModel extends SanityDocument {
  title: string;
  ingress?: SanityBlock;
  mainImage?: { asset?: { _ref: string }; alt: string };
  authors: { author: AuthorModel }[];
  isFeatured: boolean;
}

export const Article = ({ isPreview, location, history, match, slug, language }: ArticleProps) => {
  const article = useSelector<RootState, ArticleModel>(state => {
    if (isPreview) {
      const { query } = url.parse(location.search, true);
      const id = query.isDraft == 'true' ? `drafts.${match.params.id}` : `${match.params.id}`;
      return state.previews.data[id];
    }
    return state.documents.data[slug];
  });

  // eslint-disable-next-line no-underscore-dangle
  if (isPreview) {
    const { query } = url.parse(location.search, true);
    const id = query.isDraft == 'true' ? `drafts.${match.params.id}` : `${match.params.id}`;
    previewActions.setOne({ title: '', _id: '', _type: '', slug: '' });
    usePreview(location, history, id, previewActions.setOne);
  }

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isPreview) {
      if (!article) {
        dispatch(documentActions.getOne(slug));
      }
    }
  }, [location]);

  return article ? (
    <>
      <Helmet>
        <title itemProp="name" lang="en">
          Welcome to Varanity
        </title>
      </Helmet>
      <Main>
        <ArticleComponent article={article} />
      </Main>
    </>
  ) : (
    <div>Loading</div>
  );
};
