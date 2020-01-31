import React from 'react';
import { ArticleModel } from '../../pages/Article';
import { Blocks } from '../Blocks';

import classes from './Article.module.scss';

interface Props {
  article?: ArticleModel;
}

export const ArticleComponent: React.FC<Props> = ({ article }: Props) => {
  return article ? (
    <section className={classes.article}>
      <h2 className={classes.articleTitle}>{article.title}</h2>
    </section>
  ) : null;
};
