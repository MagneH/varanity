import React, { useRef, useEffect, useState } from 'react';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import styled from 'styled-components';

interface LazyImageProps {
  displayName: string;
  actualSrc?: string;
  altText?: string;
}

export const LazyImage = ({ actualSrc, displayName, altText }: LazyImageProps) => {
  const [isImageLoaded, setImageLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const img = new Image();
    if (img) {
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setHasError(true);
      if (typeof imageUrl !== 'undefined' && imageUrl) img.src = imageUrl || '';
      return () => {
        img.onload = null;
        img.onerror = null;
      };
    }
    return () => {};
  }, [imageUrl]);

  useEffect(() => {
    if (IntersectionObserver) {
      const observer = new IntersectionObserver((entries) =>
        entries.forEach(
          (entry) => {
            if (entry.isIntersecting) {
              setImageUrl(actualSrc);
            }
          },
          { rootMargin: '0px 0px 200px 0px' },
        ),
      );
      if (placeholderRef.current) {
        observer.observe(placeholderRef.current);
        return () => observer.disconnect();
      }
    } else {
      setImageUrl(actualSrc);
    }
    return () => {};
  }, [placeholderRef.current]);

  if (hasError)
    return (
      <ImagePlaceholder>
        <CameraAltOutlinedIcon color="inherit" />
        <PlaceholderTextElement>Bilde kommer snart!</PlaceholderTextElement>
      </ImagePlaceholder>
    );
  if (!isImageLoaded) return <ImagePlaceholder ref={placeholderRef} />;
  return <StyledImage ref={imageRef} src={imageUrl || undefined} alt={altText || displayName} />;
};

const ImagePlaceholder = styled.div`
  min-height: 100%;
  width: 100%;
  background-color: #c1c1c1;
`;

const StyledImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const PlaceholderTextElement = styled.span``;
