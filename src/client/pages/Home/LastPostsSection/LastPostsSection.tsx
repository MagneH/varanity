import React from 'react';
import { SanityDocument } from '@sanity/client';
import { Section } from '../../../components/Section/Section';
import { Article } from '../../../components/ArticleCard/ArticleCard';

// Styles
import classes from './LastPostsSection.module.scss';
import useSelector from '../../../redux/typedHooks';
import { ArticleModel } from '../../Article';

interface LastPostsSectionProps {
  language: string;
}

// Exports
export const LastPostsSection = ({ language }: LastPostsSectionProps) => {
  const articles = useSelector((state) =>
    Object.values(state.documents.data)
      .filter(
        (document: SanityDocument) => document._type === 'article' && document.isFeatured !== true,
      )
      .sort((e1, e2) => e1._updatedAt.localeCompare(e2._updatedAt))
      .slice(0, 4),
  );

  return (
    <Section className={classes.lastPostsSection}>
      <div className={classes.lastPostsSectionGrid}>
        {articles.map((article) => (
          <Article
            article={article as ArticleModel}
            key={`article-${article.slug.current}`}
            language={language}
          />
        ))}
      </div>
    </Section>
  );
};
