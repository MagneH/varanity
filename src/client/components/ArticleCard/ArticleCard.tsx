import React from 'react';

// Styles
import styled from 'styled-components';
// import { FiCamera } from 'react-icons/fi';
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
  const { title, mainImage, slug, mainCategory } = article;

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
      {article && mainImage ? (
        <Link to={`/${language}/${articleUrl}`}>
          <PictureWrapper>
            <Picture>
              <source type="image/webp" srcSet={srcSet} />
              <img src={src} alt="" />
            </Picture>
          </PictureWrapper>
        </Link>
      ) : (
        <Link to={`/${language}/${articleUrl}`}>
          <PicturePlaceholder>{/* <FiCamera /> */}</PicturePlaceholder>
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

const Picture = styled.picture`
  display: flex;
  flex: 1;
  flex-basis: 5em;
`;

const PictureWrapper = styled.div`
  border: 1px solid
    ${({ theme }) =>
      theme && theme.globals && theme.globals.placeholderBackground
        ? theme.globals.placeholderBackground
        : 'red'};
`;

const PicturePlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 250px;
  width: 300px;
  background-color: ${({ theme }) =>
    theme && theme.globals && theme.globals.placeholderBackground
      ? theme.globals.placeholderBackground
      : 'red'};
  svg {
    height: 60px;
    width: 60px;
    fill: ${({ theme }) =>
      theme && theme.globals && theme.globals.placeholderIcons
        ? theme.globals.placeholderIcons
        : 'red'};
  }
`;
