import React, { useEffect } from 'react';
import Helmet from 'react-helmet';
import { SanityBlock, SanityDocument } from '@sanity/client';
import { useDispatch } from 'react-redux';
import url from 'url';
import { ImageUrlBuilderOptionsWithAliases } from '@sanity/image-url/lib/types/types';
import { RouteComponentProps } from 'react-router';
import { usePreview } from '../hooks/usePreview';
import { ArticleComponent } from '../components/Article/Article';

import { actionCreators as previewActions } from '../redux/modules/previews';
import { actionCreators as documentActions } from '../redux/modules/documents';
import { Main } from '../components/Main/Main';
import { AuthorModel } from '../redux/modules/authors';
import useSelector from '../redux/typedHooks';
import { localize, useLocalize } from '../hooks/useLocalization';

// Types
export interface ArticleProps {
  isPreview?: boolean;
  isDraft?: boolean;
  location: Location;
  history: RouteComponentProps['history'];
  match: any;
  language: string;
  slug: string;
}

export interface ArticleModel extends SanityDocument {
  title: string;
  ingress?: SanityBlock[];
  body?: SanityBlock[];
  mainCategory: { _ref: string; _type: string };
  categories?: { _ref: string; _type: string }[];
  mainImage?: Partial<ImageUrlBuilderOptionsWithAliases>;
  authors: { author: AuthorModel }[];
  isFeatured: boolean;
  _createdAt: string;
}

export const Article = ({ isPreview, location, history, match, slug, language }: ArticleProps) => {
  const languageArticle = useSelector((state) => {
    if (isPreview) {
      const { query } = url.parse(location.search, true);
      const id = query.isDraft === 'true' ? `drafts.${match.params.id}` : `${match.params.id}`;
      return state.previews.data[id];
    }
    return state.documents.data[slug];
  });

  const article = useLocalize(languageArticle, [language]);

  // eslint-disable-next-line no-underscore-dangle
  if (isPreview) {
    const { query } = url.parse(location.search, true);
    const id = query.isDraft === 'true' ? `drafts.${match.params.id}` : `${match.params.id}`;
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
          {article.title}
        </title>
      </Helmet>
      <Main>
        <ArticleComponent article={article as ArticleModel} />
      </Main>
    </>
  ) : (
    <div>Loading</div>
  );
};
