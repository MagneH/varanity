import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { useDispatch } from 'react-redux';
import { SanityDocument } from '@sanity/client';

import { actionCreators as documentActions } from '../redux/modules/documents';
import { Main } from '../components/Main/Main';
import useSelector from '../redux/typedHooks';
import { Section } from '../components/Section/Section';
import classes from './Home/LastPostsSection/LastPostsSection.module.scss';
import articleClasses from '../components/Article/Article.module.scss';

import { Article } from '../components/ArticleCard/ArticleCard';
import { ArticleModel } from './Article';
import { urlFor } from '../services/SanityService';
import { ensure } from '../lib/ensure';
import { Category } from '../components/CategoryCard/CategoryCard';

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
  const childCategories = useSelector(
    state =>
      category &&
      Object.values(state.categories.data)
        .filter(e => e.parent && e.parent._ref === category._id)
        .sort((e1, e2) => e1.title.localeCompare(e2.title)),
  );

  const articles = useSelector(state =>
    Object.values(state.documents.data)
      .filter(
        document =>
          document &&
          document.categories &&
          document.categories.some((e: SanityDocument) => e._ref === category._id),
      )
      .sort((e1, e2) => e1.title.localeCompare(e2.title)),
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isFetched) {
      dispatch(documentActions.getByCategory(slug));
      setIsFetched(true);
    }
  }, [location]);

  const { mainImage } = category;
  let srcSet = '';
  let src = '';
  if (typeof mainImage !== 'undefined' && typeof mainImage.asset !== 'undefined') {
    srcSet =
      urlFor(ensure(mainImage))
        .withOptions(mainImage)
        .format('webp')
        .width(2000)
        .fit('max')
        .url() || '';
    src =
      urlFor(ensure(mainImage))
        .withOptions(mainImage)
        .width(150)
        .height(150)
        .fit('max')
        .url() || '';
  }

  return category ? (
    <>
      <Helmet>
        <title itemProp="name" lang="en">
          {category.title}
        </title>
      </Helmet>
      <Main>
        {mainImage && mainImage.asset && mainImage.asset._ref && (
          <picture className={articleClasses.articleMainImageContainer}>
            <source type="image/webp" srcSet={srcSet || ''} />
            <img src={src || ''} alt={mainImage.alt} />
          </picture>
        )}
        {childCategories.length > 0 && (
          <Section className={classes.lastPostsSection}>
            <h1>{category.title}</h1>
            <h2>Categories</h2>
            <div className={classes.lastPostsSectionGrid}>
              {childCategories.map(childCategory => (
                <Category
                  category={childCategory}
                  key={`childCategory-${childCategory.slug.current}`}
                  language={language}
                />
              ))}
            </div>
          </Section>
        )}
        {articles.length > 0 && (
          <Section className={classes.lastPostsSection}>
            <h2>Articles</h2>
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
        )}
      </Main>
    </>
  ) : (
    <div>Loading</div>
  );
};
