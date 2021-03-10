import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { useDispatch } from 'react-redux';
import { SanityDocument } from '@sanity/client';

import { RouteComponentProps } from 'react-router';
import { actions as documentActions } from '../redux/modules/documents';
import { Main } from '../components/Main/Main';
import useSelector from '../redux/typedHooks';
import { Section } from '../components/Section/Section';
import classes from './Home/LastPostsSection/LastPostsSection.module.scss';
import articleClasses from '../components/Article/Article.module.scss';

import { Article } from '../components/ArticleCard/ArticleCard';
import { LocalizedArticleModel } from './Article';
import { urlFor } from '../services/SanityService';
import { ensure } from '../lib/ensure';
import { Category } from '../components/CategoryCard/CategoryCard';
import { Languages, useLocalize } from '../hooks/useLocalization';
import { LocalizedCategoryModel } from '../redux/modules/categories';

// Types
export interface CategoryListProps {
  location: Location;
  history: RouteComponentProps['history'];
  match: any;
  language: Languages;
  slug: string;
}

export const ArticleList = ({ location, slug, language }: CategoryListProps) => {
  const [isFetched, setIsFetched] = useState(false);
  const category = useSelector((state) => state.categories.data[slug]);
  const localizedCategory = useLocalize<LocalizedCategoryModel>(category, [language]);

  const childCategories = useSelector(
    (state) =>
      localizedCategory &&
      Object.values(state.categories.data).filter(
        (e) => e.parent && e.parent._ref === localizedCategory._id,
      ),
  );
  const localizedChildCategories = useLocalize<LocalizedCategoryModel[]>(childCategories, [
    language,
  ]).sort((e1, e2) => e1.title.localeCompare(e2.title));

  const articles = useSelector((state) =>
    Object.values(state.documents.data).filter(
      (document) =>
        (document &&
          document.categories &&
          document.categories.some((e: SanityDocument) => e._ref === localizedCategory._id)) ||
        (!!document.mainCategory && document.mainCategory._ref === localizedCategory._id),
    ),
  );
  const localizedArticles = useLocalize<LocalizedArticleModel[]>(articles, [
    language,
  ]).sort((e1, e2) => e1.title.localeCompare(e2.title));

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isFetched) {
      dispatch(documentActions.getByCategory.request(slug));
      setIsFetched(true);
    }
  }, [location]);

  const { mainImage } = localizedCategory;
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
      urlFor(ensure(mainImage)).withOptions(mainImage).width(150).height(150).fit('max').url() ||
      '';
  }
  return localizedCategory ? (
    <>
      <Helmet>
        <title itemProp="name" lang="en">
          {localizedCategory.title}
        </title>
      </Helmet>
      <Main>
        {mainImage && mainImage.asset && mainImage.asset._ref && (
          <picture className={articleClasses.articleMainImageContainer}>
            <source type="image/webp" srcSet={srcSet || ''} />
            <img src={src || ''} alt={mainImage.alt} />
          </picture>
        )}
        {localizedChildCategories.length > 0 && (
          <Section className={classes.lastPostsSection}>
            {localizedCategory.title !== 'Categories' && <h1>{localizedCategory.title}</h1>}
            <h2>{language === 'no' ? 'Kategorier' : 'Categories'}</h2>
            <div className={classes.lastPostsSectionGrid}>
              {localizedChildCategories.map((childCategory) => (
                <Category
                  category={childCategory}
                  key={`childCategory-${childCategory.slug.current}`}
                  language={language}
                />
              ))}
            </div>
          </Section>
        )}
        {localizedArticles.length > 0 && (
          <Section className={classes.lastPostsSection}>
            <h2>{language === Languages.en ? 'Articles' : 'Artikler'}</h2>
            <div className={classes.lastPostsSectionGrid}>
              {localizedArticles.map((article) => (
                <Article
                  article={article}
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
