import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { useDispatch } from 'react-redux';
import url from 'url';
import { SanityDocument } from '@sanity/client';
import { usePreview } from '../hooks/usePreview';
import { ArticleComponent } from '../components/Article/Article';
import { RootState } from '../redux';

import { actionCreators as previewActions } from '../redux/modules/previews';
import { actionCreators as documentActions } from '../redux/modules/documents';
import { Main } from '../components/Main/Main';
import { CategoryModel } from '../redux/modules/categories';
import useSelector from '../redux/typedHooks';
import { Section } from '../components/Section/Section';
import classes from './Home/LastPostsSection/LastPostsSection.module.scss';
import { Article } from '../components/ArticleCard/ArticleCard';
import { ArticleModel } from './Article';

// Types
export interface CategoryListProps {
  location: Location;
  history: History;
  match: any;
  language: string;
  slug: string;
}

export const ArticleList = ({ location, history, match, slug, language }: CategoryListProps) => {
  const [isFetched, setIsFetched] = useState(false);
  const category = useSelector(state => state.categories.data[slug]);

  const articles = useSelector(state => Object.values(state.documents.data).filter(document =>
    document && document.categories && document.categories.some((e: SanityDocument) => e._ref === category._id),
  ));

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isFetched) {
      dispatch(documentActions.getByCategory(slug));
      setIsFetched(true);
    }
  }, [location]);

  return category ? (
    <>
      <Helmet>
        <title itemProp="name" lang="en">
          {category.title}
        </title>
      </Helmet>
      <Main>
        <Section className={classes.lastPostsSection}>
          <h2>
            {category.title}
          </h2>
          <div className={classes.lastPostsSectionGrid}>
            {articles.map(article => (
              <Article
                article={article as ArticleModel}
                key={`article-${article.slug.current}`}
                language={language}
              />
            ))}
          </div>
        </Section>
      </Main>
    </>
  ) : (
    <div>Loading</div>
  );
};
