import React from 'react';
import { useSelector } from 'react-redux';
import { SanityDocument } from '@sanity/client';
import { Section } from '../../../components/Section/Section';
import { Article } from '../../../components/ArticleCard/ArticleCard';

// Styles
import classes from './LastPostsSection.module.scss';
import { RootState } from '../../../redux';
import { ArticleModel } from '../../Article';

// Exports
export const LastPostsSection = () => {
  const articles = useSelector<RootState, ArticleModel[]>(state => {
    return Object.values(state.documents.data).filter(
      (document: SanityDocument) => document._type === 'article' && document.isOnFrontPage === true && !document.isFeatured,
    );
  });

  return (
    <Section className={classes.lastPostsSection}>
      <div className={classes.lastPostsSectionGrid}>
        {articles.map((article) => (
          <Article article={article} key={`article-${article.slug.current}`}/>
        ))}
      </div>
    </Section>
  );
};
