import { gql } from '@apollo/client';

export const mainImageFragment = gql`
  fragment mainImageKeys on MainImage {
    _key
    _type
    caption
    alt
    asset {
      _id
      _type
      originalFilename
      label
      title
      description
      sha1hash
      extension
      mimeType
      size
      assetId
      path
      url
      source {
        _key
        _type
        name
        id
        url
      }
    }
    hotspot {
      _key
      _type
      x
      y
      height
      width
    }
    crop {
      _key
      _type
      top
      bottom
      left
      right
    }
  }
`;
