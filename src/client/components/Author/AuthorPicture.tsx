import React from 'react';
import { urlFor } from '../../services/SanityService';
import { ensure } from '../../lib/ensure';
import classes from './AuthorPicture.module.scss';

interface AuthorPictureProps {
  image: {
    asset: { _ref: string };
    alt: string;
  };
}

export const AuthorPicture = ({ image }: AuthorPictureProps) => {
  let srcSet = '';
  let src = '';
  if (typeof image !== 'undefined') {
    srcSet =
      urlFor(ensure(image)).withOptions(image).format('webp').width(2000).fit('max').url() || '';
    src = urlFor(ensure(image)).withOptions(image).width(150).height(150).fit('max').url() || '';
  }
  return (
    <>
      {image && image.asset && image.asset._ref && (
        <picture>
          <source type="image/webp" srcSet={srcSet || ''} />
          <img src={src || ''} alt={image.alt} className={classes.authorPicture} />
        </picture>
      )}
    </>
  );
};
