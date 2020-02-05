import React, { ReactNode } from 'react';
import { SanityBlock } from '@sanity/client';

// Styles
import classes from './ArticleCard.module.scss';
import { urlFor } from '../../services/SanityService';
import { ArticleModel } from '../../pages/Article';
import { Link } from '../Link/Link';

// Types
interface ArticleProps {
  article: ArticleModel;
  language: string;
}

export const Article = ({ article, language }: ArticleProps) => {
  const { ingress, title, mainImage, slug } = article;
  return (
    <div className={classes.post}>
      {article && mainImage && mainImage.asset && mainImage.asset._ref && (
        <Link to={`${language}/articles/${slug.current}`}>
          <picture className={classes.postImage}>
            <source
              type="image/webp"
              srcSet={[
                urlFor(mainImage.asset._ref)
                  .format('webp')
                  .width(300)
                  .height(250)
                  .fit('max')
                  .url(),
              ]}
            />
            <img
              src={urlFor(mainImage.asset._ref)
                .width(150)
                .height(150)
                .fit('max')
                .url()}
              alt=""
            />
          </picture>
        </Link>
      )}
      <Link
        className={classes.postLink}
        to={`${language}/articles/${slug.current}`}
        aria-label={article.title}
      >
        <h2 className={classes.postTitle}>{title}</h2>
      </Link>
      {ingress && <small className={classes.postIngress}>{ingress}</small>}
    </div>
  );
};
