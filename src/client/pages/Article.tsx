import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { SanityBlock, SanityDocument } from '@sanity/client';
import { useDispatch } from 'react-redux';
import url from 'url';
import { SanityImageObject } from '@sanity/image-url/lib/types/types';
import { RouteComponentProps } from 'react-router';
import { usePreview } from '../hooks/usePreview';
import { ArticleComponent } from '../components/Article/Article';

import { actionCreators as previewActions } from '../redux/modules/previews';
import { actions as documentActions } from '../redux/modules/documents';
import { Main } from '../components/Main/Main';
import { AuthorModel } from '../redux/modules/authors';
import useSelector from '../redux/typedHooks';
import { Languages, useLocalize } from '../hooks/useLocalization';
import { NotFound } from './errors/NotFound/NotFound';
import { useDataInterpolation } from '../hooks/useDataInterpolation';

// Types
export interface ArticleProps {
  isPreview?: boolean;
  isDraft?: boolean;
  location: Location;
  history: RouteComponentProps['history'];
  match: any;
  language: Languages;
  slug: string;
}

export interface ArticleModel extends SanityDocument {
  title: Record<Languages, string>;
  ingress?: Record<Languages, SanityBlock[]>;
  body?: Record<Languages, SanityBlock[]>;
  mainCategory: { _ref: string; _type: string };
  categories?: { _ref: string; _type: string }[];
  mainImage?: SanityImageObject & { alt: string };
  authors: { author: AuthorModel }[];
  isFeatured: boolean;
  _createdAt: string;
}

export interface LocalizedArticleModel extends SanityDocument {
  title: string;
  ingress?: SanityBlock[];
  body?: SanityBlock[];
  mainCategory: { _ref: string; _type: string; _id: string };
  categories?: { _ref: string; _type: string; _id: string }[];
  mainImage?: SanityImageObject & { alt: string };
  authors: { author: AuthorModel }[];
  isFeatured: boolean;
  _createdAt: string;
}

export const Article = ({ isPreview, location, history, match, slug, language }: ArticleProps) => {
  const [didFetch, setDidFetch] = useState(false);
  const isLoading = useSelector((state) => state.documents.isLoading);
  const languageArticle = useSelector((state) => {
    if (isPreview) {
      const { query } = url.parse(location.search, true);
      const id = query.isDraft === 'true' ? `drafts.${match.params.id}` : `${match.params.id}`;
      return state.previews.data[id];
    }
    return state.documents.data[slug];
  });

  const article = useLocalize<LocalizedArticleModel>(languageArticle, [language]);
  console.log('Localized: ', article);
  const data = useSelector((state) => state.apiData.data);

  const articleWithData = useDataInterpolation<LocalizedArticleModel>(article, data);
  console.log('Med data: ', articleWithData);

  // eslint-disable-next-line no-underscore-dangle
  if (isPreview) {
    const { query } = url.parse(location.search, true);
    const id = query.isDraft === 'true' ? `drafts.${match.params.id}` : `${match.params.id}`;
    usePreview(location, history, id, previewActions.setOne);
  }

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isPreview) {
      if (!articleWithData) {
        setDidFetch(true);
        dispatch(documentActions.getOne.request(slug));
      }
    }
  }, [location]);

  if (didFetch && !isLoading && !articleWithData) {
    return <NotFound />;
  }

  console.log(articleWithData);

  console.log('Language:', language);

  return articleWithData ? (
    <>
      <Helmet>
        <title itemProp="name" lang="en">
          {articleWithData.title}
        </title>
      </Helmet>
      <Main>
        <ArticleComponent article={articleWithData} language={language} />
      </Main>
    </>
  ) : (
    <div>Loading Article</div>
  );
};
