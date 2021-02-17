import React from 'react';

// Styles
import styled from 'styled-components';
// import { FiCamera } from 'react-icons/fi';
import classes from './ArticleCard.module.scss';
import { ArticleModel } from '../../pages/Article';
import { Link } from '../Link/Link';
import { useCategoryUrl } from '../../hooks/useCategoryUrl';
import { useMainImage } from '../../hooks/useMainImage';
import { LazyImage } from '../LazyImage/LazyImage';

// Types
interface ArticleProps {
  article: ArticleModel;
  language: string;
}

export const Article = ({ article, language }: ArticleProps) => {
  const { title, mainImage, slug, mainCategory } = article;

  const articleUrl = useCategoryUrl(mainCategory && mainCategory._ref, slug.current);
  const [src] = useMainImage(mainImage);

  return (
    <div className={classes.post}>
      {article && (
        <Link to={`/${language}/${articleUrl}`}>
          <PictureWrapper>
            <LazyImage displayName={(mainImage && mainImage.alt) || ''} actualSrc={src} />
          </PictureWrapper>
        </Link>
      )}
      <Link
        className={classes.postLink}
        to={`/${language}/${articleUrl}`}
        aria-label={article.title}
      >
        <h2 className={classes.postTitle}>{title}</h2>
      </Link>
    </div>
  );
};

const PictureWrapper = styled.div`
  line-height: 0;
  width: 300px;
  height: 250px;
  border: 1px solid
    ${({ theme }) =>
      theme && theme.globals && theme.globals.placeholderBackground
        ? theme.globals.placeholderBackground
        : 'red'};
`;
