import React, { useMemo } from 'react';
import { uniqBy } from 'lodash';
import styled from 'styled-components';
import { ArticleModel } from '../../pages/Article';
import { Blocks } from '../Blocks';

import classes from './Article.module.scss';
import { urlFor } from '../../services/SanityService';
import { ensure } from '../../lib/ensure';
import { AuthorModel } from '../../redux/modules/authors';
import { AuthorCard } from '../Author/AuthorCard';
import useSelector from '../../redux/typedHooks';
import { CategoryModel } from '../../redux/modules/categories';

interface ArticleProps {
  article: ArticleModel;
}

export const ArticleComponent = ({ article }: ArticleProps) => {
  const authorList = useSelector((state) =>
    article.authors
      ? article.authors
          .map((authorObject) => {
            if (typeof authorObject.author !== 'undefined') {
              return state.authors.data[authorObject.author._ref];
            }
            return null;
          })
          .filter((obj: any) => ![null, undefined].includes(obj))
      : [],
  );

  const stateCategories = useSelector((state) => state.categories.data);

  const categoryIdMap = useMemo(
    () =>
      Object.values(stateCategories).reduce(
        (acc: Record<CategoryModel['_id'], CategoryModel>, cur) => {
          acc[cur._id] = cur;
          return acc;
        },
        {},
      ),
    [stateCategories],
  );
  let categoryIds = [article.mainCategory];

  if (article && article.categories) {
    categoryIds = categoryIds.concat(article.categories);
  }
  const categories = uniqBy(
    categoryIds.map((e) => categoryIdMap[e._ref]),
    '_id',
  );

  const { mainImage } = article;
  let srcSet = '';
  let src = '';
  if (typeof mainImage !== 'undefined' && typeof mainImage.asset !== 'undefined') {
    srcSet = urlFor(ensure(mainImage)).withOptions({ mainImage }).format('webp').url() || '';
    src = urlFor(mainImage).withOptions({ mainImage }).url() || '';
  }

  return article ? (
    <section className={classes.article}>
      {mainImage && mainImage.asset && mainImage.asset._ref ? (
        <Picture>
          <source type="image/webp" srcSet={srcSet || ''} />
          <img src={src || ''} alt={mainImage.alt} />
        </Picture>
      ) : (
        <PicturePlaceholder />
      )}
      <div className={classes.articleContentWrapper}>
        <div className={classes.articleContent}>
          <h1 className={classes.articleTitle}>{article.title}</h1>
          <ul className={classes.articleAuthorList}>
            {authorList &&
              authorList.map((author) => (
                <li key={`${(author as AuthorModel).slug.current}`}>
                  <AuthorCard author={author as AuthorModel} />
                </li>
              ))}
          </ul>
          {article.body && (
            <div className={classes.articleContent}>
              <Blocks body={article.body} />
            </div>
          )}
          {categories && (
            <ul className={classes.tagList}>
              {categories.map(
                (category) =>
                  category && (
                    <li key={category._id} className={classes.tag}>
                      {category.title}
                    </li>
                  ),
              )}
            </ul>
          )}
        </div>
      </div>
    </section>
  ) : null;
};

const Picture = styled.picture`
  flex: 1;
  flex-basis: 5em;
  min-width: 100%;
  width: 100%;
  img {
    width: 100%;
    object-fit: contain;
  }
  source {
    height: 0;
  }
`;

const PicturePlaceholder = styled.div`
  flex: 1;
  flex-basis: 5em;
  min-width: 100%;
  width: 100%;
  height: 100px;
`;
