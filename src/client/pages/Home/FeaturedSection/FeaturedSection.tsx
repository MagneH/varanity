import React from 'react';

// Styles
import { SanityDocument } from '@sanity/client';
import classes from './FeaturedSection.module.scss';
import { urlFor } from '../../../services/SanityService';
import { Link } from '../../../components/Link/Link';
import useSelector from '../../../redux/typedHooks';
import { useCategoryUrl } from '../../../hooks/useCategoryUrl';
import { ArticleModel } from '../../Article';

interface FeaturedSectionProps {
  language: string;
}

// Exports
export const FeaturedSection = ({ language }: FeaturedSectionProps) => {
  const featuredArticle = useSelector(state => {
    return Object.values(state.documents.data).find(
      (document: SanityDocument) => document.isFeatured === true,
    );
  });
  const srcSet =
    featuredArticle && featuredArticle.mainImage && featuredArticle.mainImage
      ? urlFor(featuredArticle.mainImage)
          .withOptions(featuredArticle.mainImage)
          .format('webp')
          .width(2000)
          .fit('max')
          .url()
      : '';
  const src =
    featuredArticle && featuredArticle.mainImage && featuredArticle.mainImage
      ? urlFor(featuredArticle.mainImage)
          .withOptions(featuredArticle.mainImage)
          .width(150)
          .height(150)
          .fit('max')
          .url()
      : '';

  const { mainCategory, slug } = (featuredArticle as ArticleModel);
  const articleUrl =
    mainCategory && useCategoryUrl(mainCategory && mainCategory._ref, slug.current);

  return featuredArticle ? (
    <section className={classes.featuredSection}>
      {featuredArticle.mainImage && src && (
          <Link to={`/${language}/${articleUrl}`}>
            <picture className={classes.featuredSectionImageContainer}>
              <source type="image/webp" srcSet={srcSet || ''} />
              <img src={src || ''} alt={featuredArticle.mainImage.alt} />
            </picture>
          </Link>
        )}
      <Link to={`/${language}/${articleUrl}`} className={classes.link}>
        <h2 className={classes.featuredSectionTitle}>{featuredArticle.title}</h2>
      </Link>
      {/*
      {ingress && <small className={classes.featuredSectionIngress}>{ingress}</small>}
*/}
    </section>
  ) : null;
};
