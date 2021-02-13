import { gql } from '@apollo/client';
import { mainImageFragment } from '../../../graphql/mainImageFragment';

export const FEATURED_ARTICLES = gql`
  ${mainImageFragment}
  query {
    allArticle(where: { isFeatured: { eq: true } }) {
      mainCategory {
        _id
        _type
        _createdAt
        _updatedAt
        _rev
        _key
        title
        description
        mainImage {
          ...mainImageKeys
        }
        slug {
          current
        }
      }
      mainImage {
        ...mainImageKeys
      }
      slug {
        current
      }
      title
      ingress {
        _key
        _type
        enRaw
      }
    }
  }
`;
