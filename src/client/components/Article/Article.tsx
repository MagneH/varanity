import React from 'react';
import {useSelector} from "react-redux";
import { ArticleModel } from '../../pages/Article';
import { Blocks } from '../Blocks';

import classes from './Article.module.scss';
import { urlFor } from '../../services/SanityService';
import { ensure } from '../../lib/ensure';
import { AuthorModel } from '../../redux/modules/authors';
import { AuthorCard } from '../Author/AuthorCard';
import {RootState} from "../../redux";

interface ArticleProps {
  article: ArticleModel;
}

export const ArticleComponent = ({ article }: ArticleProps) => {
  const { mainImage } = article;
  const authorList = useSelector<RootState, AuthorModel[]>(state => {
    return article.authors.map(authorObject => {
      if( typeof authorObject.author !== 'undefined') {
        return state.authors.data[authorObject.author._ref]
      }
      return null;
    }).filter((obj) => { return ![null, undefined].includes(obj) });
  });
  let srcSet = '';
  let src = '';
  if (typeof mainImage !== 'undefined') {
    srcSet =
      urlFor(ensure(mainImage.asset)._ref)
        .format('webp')
        .width(2000)
        .fit('max')
        .url() || '';
    src =
      urlFor(ensure(mainImage.asset)._ref)
        .width(150)
        .height(150)
        .fit('max')
        .url() || '';
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
            {article.authors &&
            authorList.map((author: AuthorModel) => {
                return (
                  <li key={`${author.slug.current}`}>
                    <AuthorCard author={author} />
                  </li>
                );
              })}
          </ul>
          {article.body && (
            <div className={classes.articleContent}>
              <Blocks body={article.body} />
            </div>
          )}
        </div>
      </div>
    </section>
  ) : null;
};
