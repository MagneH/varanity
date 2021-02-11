import React from 'react';

// Styles
import classes from './ArticleCard.module.scss';
import { urlFor } from '../../services/SanityService';
import { ArticleModel } from '../../pages/Article';
import { Link } from '../Link/Link';
import { useCategoryUrl } from '../../hooks/useCategoryUrl';
import { ensure } from '../../lib/ensure';

// Types
interface ArticleProps {
  article: ArticleModel;
  language: string;
}

export const Article = ({ article, language }: ArticleProps) => {
  const { ingress, title, mainImage, slug, mainCategory } = article;

  const articleUrl = useCategoryUrl(mainCategory && mainCategory._ref, slug.current);

  let srcSet = '';
  let src = '';
  if (typeof mainImage !== 'undefined' && typeof mainImage.asset !== 'undefined') {
    srcSet =
      urlFor(ensure(mainImage))
        .withOptions({ mainImage })
        .width(300)
        .height(250)
        .format('webp')
        .url() || '';
    src = urlFor(mainImage).withOptions({ mainImage }).width(300).height(250).url() || '';
  }

  return (
    <div className={classes.post}>
      {article && mainImage && (
        <Link to={`/${language}/${articleUrl}`}>
          <picture className={classes.postImage}>
            <source type="image/webp" srcSet={srcSet} />
            <img src={src} alt="" />
          </picture>
        </Link>
      )}
      <Link
        className={classes.postLink}
        to={`/${language}/${articleUrl}`}
        aria-label={article.title}
      >
        <h2 className={classes.postTitle}>{title}</h2>
      </Link>
      {ingress && <small className={classes.postIngress}>{ingress}</small>}
    </div>
  );
};
