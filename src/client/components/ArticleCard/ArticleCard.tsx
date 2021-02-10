import React from 'react';

// Styles
import classes from './ArticleCard.module.scss';
import { urlFor } from '../../services/SanityService';
import { ArticleModel } from '../../pages/Article';
import { Link } from '../Link/Link';
import { CategoryModel } from '../../redux/modules/categories';
import { useCategoryUrl } from '../../hooks/useCategoryUrl';

// Types
interface ArticleProps {
  article: ArticleModel;
  language: string;
}

export const Article = ({ article, language }: ArticleProps) => {
  const { ingress, title, mainImage, slug, mainCategory } = article;

  const articleUrl = useCategoryUrl(mainCategory && mainCategory._ref, slug.current);
  console.log(mainCategory && mainCategory._ref, slug.current);
  return (
    <div className={classes.post}>
      {article && mainImage && mainImage.asset && mainImage.asset._ref && (
        <Link to={`/${language}/${articleUrl}`}>
          <picture className={classes.postImage}>
            <source
              type="image/webp"
              srcSet={[
                urlFor(mainImage)
                  .withOptions(mainImage)
                  .format('webp')
                  .width(300)
                  .height(250)
                  .fit('max')
                  .url(),
              ]}
            />
            <img
              src={urlFor(mainImage)
                .withOptions(mainImage)
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
        to={`/${language}/${articleUrl}`}
        aria-label={article.title}
      >
        <h2 className={classes.postTitle}>{title}</h2>
      </Link>
      {ingress && <small className={classes.postIngress}>{ingress}</small>}
    </div>
  );
};
