import { SanityImageObject } from '@sanity/image-url/lib/types/types';
import { useEffect, useState } from 'react';
import { urlFor } from '../services/SanityService';
import { ensure } from '../lib/ensure';

export const useMainImage = (
  mainImage: SanityImageObject | undefined,
): [string | undefined, string | undefined] => {
  const [src, setSrc] = useState('');
  const [srcSet, setSrcSet] = useState('');
  useEffect(() => {
    if (typeof mainImage !== 'undefined' && typeof mainImage.asset !== 'undefined') {
      if (mainImage) {
        const srcSetString = urlFor(ensure(mainImage))
          .withOptions({ mainImage })
          .format('webp')
          .url();
        if (srcSetString) setSrcSet(srcSetString);
        setSrc(urlFor(mainImage).withOptions({ mainImage }).url() || '');
      }
    }
  }, [mainImage]);
  return [src, srcSet];
};
