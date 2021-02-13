import React from 'react';

// Styles
import { useQuery } from '@apollo/client';
import classes from './FeaturedSection.module.scss';
import { urlFor } from '../../../services/SanityService';
import { Link } from '../../../components/Link/Link';
import { useCategoryUrl } from '../../../hooks/useCategoryUrl';
import { ensure } from '../../../lib/ensure';
import { Blocks } from '../../../components/Blocks';
import { FEATURED_ARTICLES } from './FeaturedSection.query';

interface FeaturedSectionProps {
  language: string;
}

// Exports
export const FeaturedSection = ({ language }: FeaturedSectionProps) => {
  const { loading, error, data } = useQuery(FEATURED_ARTICLES);
  const featuredArticle = (data && data.allArticle[0]) || {};
  const { mainImage, mainCategory, slug, title, ingress } = featuredArticle;

  let srcSet = '';
  let src = '';
  if (typeof mainImage !== 'undefined' && typeof mainImage.asset !== 'undefined') {
    srcSet = urlFor(ensure(mainImage)).withOptions({ mainImage }).format('webp').url() || '';
    src = urlFor(mainImage).withOptions({ mainImage }).url() || '';
  }

  const articleUrl = mainCategory && useCategoryUrl(mainCategory && mainCategory._id, slug.current);

  return featuredArticle ? (
    <>
      {mainImage && src && (
        <Link to={`/${language}/${articleUrl}`}>
          <picture className={classes.articleMainImageContainer}>
            <source type="image/webp" srcSet={srcSet || ''} />
            <img src={src || ''} alt={mainImage.alt} />
          </picture>
        </Link>
      )}
      <section className={classes.featuredSection}>
        <Link to={`/${language}/${articleUrl}`} className={classes.link}>
          <h2 className={classes.featuredSectionTitle}>{title}</h2>
        </Link>
        {ingress && <Blocks body={ingress.enRaw} />}
      </section>
    </>
  ) : null;
};
