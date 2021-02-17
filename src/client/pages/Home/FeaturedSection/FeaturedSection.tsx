import React from 'react';

// Styles
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { Link } from '../../../components/Link/Link';
import { useCategoryUrl } from '../../../hooks/useCategoryUrl';
import { Blocks } from '../../../components/Blocks';
import { FEATURED_ARTICLES } from './FeaturedSection.query';
import { useMainImage } from '../../../hooks/useMainImage';

interface FeaturedSectionProps {
  language: string;
}

// Exports
export const FeaturedSection = ({ language }: FeaturedSectionProps) => {
  const { data } = useQuery(FEATURED_ARTICLES);
  const featuredArticle = (data && data.allArticle[0]) || {};
  const { mainImage, mainCategory = {}, slug = {}, title, ingress } = featuredArticle;

  const [src, srcSet] = useMainImage(mainImage);
  const articleUrl = useCategoryUrl(mainCategory._id, slug.current);

  return featuredArticle ? (
    <>
      {mainImage && src && (
        <Link to={`/${language}/${articleUrl}`}>
          <Picture>
            <source type="image/webp" srcSet={srcSet || ''} />
            <img src={src || ''} alt={mainImage.alt} />
          </Picture>
        </Link>
      )}
      <Section>
        <StyledTextLink to={`/${language}/${articleUrl}`}>
          <Title>{title}</Title>
        </StyledTextLink>
        {ingress && <Blocks body={ingress.enRaw} />}
      </Section>
    </>
  ) : null;
};

const Picture = styled.picture`
  flex: 1;
  flex-basis: 5em;
  min-width: 100%;
  width: 100%;
  img {
    width: 100%;
    object-fit: contain;
  }
  source {
    height: 0;
  }
`;

const Section = styled.section`
  display: flex;
  flex: 1;
  justify-self: center;
  align-self: flex-start;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-size: 0.9em;
  width: 100%;
  a {
    width: 100%;
  }
`;

const StyledTextLink = styled(Link)`
  text-decoration: none;
  color: var(--color-text);
  :hover {
    text-decoration: underline;
  }
`;

const Title = styled.h2`
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 0;
  font-size: 3.2em;
`;
