import React from 'react';

// Styles
import { SanityDocument } from '@sanity/client';
import classes from './FeaturedSection.module.scss';
import { urlFor } from '../../../services/SanityService';
import { Link } from '../../../components/Link/Link';
import useSelector from '../../../redux/typedHooks';
import { useCategoryUrl } from '../../../hooks/useCategoryUrl';
import { ArticleModel } from '../../Article';
import { ensure } from '../../../lib/ensure';

interface FeaturedSectionProps {
  language: string;
}

// Exports
export const FeaturedSection = ({ language }: FeaturedSectionProps) => {
  const featuredArticle = useSelector(state => {
    return Object.values(state.documents.data).find(
      (document: SanityDocument) => document.isFeatured === true,
    );
  }) || {mainImage: undefined, title: ''};

  console.log(featuredArticle);

  const { mainImage } = featuredArticle;
  let srcSet = '';
  let src = '';
  if (typeof mainImage !== 'undefined' && typeof mainImage.asset !== 'undefined') {
    srcSet =
      urlFor(ensure(mainImage))
        .withOptions({ mainImage })
        .format('webp')
        .url() || '';
    src =
      urlFor(mainImage)
        .withOptions({ mainImage })
        .url() || '';
  }

  const { mainCategory, slug, ingress } = featuredArticle as ArticleModel;
  const articleUrl =
    mainCategory && useCategoryUrl(mainCategory && mainCategory._ref, slug.current);

  return featuredArticle ? (
    <>
      {featuredArticle.mainImage && src && (
        <Link to={`/${language}/${articleUrl}`}>
          <picture className={classes.articleMainImageContainer}>
            <source type="image/webp" srcSet={srcSet || ''} />
            <img src={src || ''} alt={featuredArticle.mainImage.alt} />
          </picture>
        </Link>
      )}
      <section className={classes.featuredSection}>
        <Link to={`/${language}/${articleUrl}`} className={classes.link}>
          <h2 className={classes.featuredSectionTitle}>{featuredArticle.title}</h2>
        </Link>
        {ingress && <small className={classes.featuredSectionIngress}>{ingress}</small>}
      </section>
    </>
  ) : null;
};
