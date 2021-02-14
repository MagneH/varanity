import React, { useMemo } from 'react';
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
      Object.values(stateCategories).reduce((acc: Record<CategoryModel['_id'], CategoryModel>, cur) => {
        acc[cur._id] = cur;
        return acc;
      }, {}),
    [stateCategories],
  );
  const categories = [article.mainCategory, ...article.categories].map((e) => categoryIdMap[e._ref]);

  const { mainImage } = article;
  let srcSet = '';
  let src = '';
  if (typeof mainImage !== 'undefined' && typeof mainImage.asset !== 'undefined') {
    srcSet = urlFor(ensure(mainImage)).withOptions({ mainImage }).format('webp').url() || '';
    src = urlFor(mainImage).withOptions({ mainImage }).url() || '';
  }

  return article ? (
    <section className={classes.article}>
      {mainImage && mainImage.asset && mainImage.asset._ref && (
        <picture className={classes.articleMainImageContainer}>
          <source type="image/webp" srcSet={srcSet || ''} />
          <img src={src || ''} alt={mainImage.alt} />
        </picture>
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
          {article.ingress && (
            <div className={classes.articleContent}>
              <Blocks body={article.ingress} />
            </div>
          )}
          {article.body && (
            <div className={classes.articleContent}>
              <Blocks body={article.body} />
            </div>
          )}
          {categories && (
            <ul className={classes.tagList}>
              {categories.map(
                (category) =>
                  category && <li key={category._id} className={classes.tag}>{category.title}</li>,
              )}
            </ul>
          )}
        </div>
      </div>
    </section>
  ) : null;
};
