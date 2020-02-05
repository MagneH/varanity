import React from 'react';

// Styles
import { useSelector } from 'react-redux';
import { SanityDocument } from '@sanity/client';
import classes from './FeaturedSection.module.scss';
import { urlFor } from '../../../services/SanityService';
import { RootState } from '../../../redux';
import { ArticleModel } from '../../Article';
import { Link } from '../../../components/Link/Link';

interface FeaturedSectionProps {
  language: string;
}

// Exports
export const FeaturedSection = ({ language }: FeaturedSectionProps) => {
  const [featuredArticle] = useSelector<RootState, ArticleModel>(state => {
    return Object.values(state.documents.data).filter(
      (document: SanityDocument) => document._type === 'article' && document.isFeatured === true,
    );
  });
  const srcSet =
    featuredArticle && featuredArticle.mainImage.asset
      ? urlFor(featuredArticle.mainImage.asset._ref)
          .format('webp')
          .width(2000)
          .fit('max')
          .url()
      : '';
  const src =
    featuredArticle && featuredArticle.mainImage.asset
      ? urlFor(featuredArticle.mainImage.asset._ref)
          .width(150)
          .height(150)
          .fit('max')
          .url()
      : '';
  return featuredArticle ? (
    <section className={classes.featuredSection}>
      {featuredArticle.mainImage &&
        featuredArticle.mainImage.asset &&
        featuredArticle.mainImage.asset._ref && (
          <Link to={`${language}/articles/${featuredArticle.slug.current}`}>
            <picture className={classes.featuredSectionImageContainer}>
              <source type="image/webp" srcSet={srcSet || ''} />
              <img src={src || ''} alt={featuredArticle.mainImage.alt} />
            </picture>
          </Link>
        )}
      <Link to={`${language}/articles/${featuredArticle.slug.current}`} className={classes.link}>
        <h2 className={classes.featuredSectionTitle}>{featuredArticle.title}</h2>
      </Link>
      {/*
      {ingress && <small className={classes.featuredSectionIngress}>{ingress}</small>}
*/}
    </section>
  ) : null;
};
