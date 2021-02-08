import React from 'react';
import { useSelector } from 'react-redux';
import { PageModel } from '../../pages/Page';
import { Blocks } from '../Blocks';

import classes from './Page.module.scss';
import { urlFor } from '../../services/SanityService';
import { ensure } from '../../lib/ensure';
import { AuthorModel } from '../../redux/modules/authors';
import { AuthorCard } from '../Author/AuthorCard';
import { RootState } from '../../redux';

interface PageProps {
  page: PageModel;
}

export const PageComponent = ({ page }: PageProps) => {
  const { mainImage } = page;
  const authorList = useSelector<RootState, AuthorModel[]>(state => {
    return page.authors
      ? page.authors
          .map((authorObject: any | null) => {
            if (typeof authorObject.author !== 'undefined') {
              return state.authors.data[authorObject.author._ref];
            }
            return null;
          })
          .filter((obj: any) => ![null, undefined].includes(obj))
      : [];
  });
  let srcSet = '';
  let src = '';
  if (typeof mainImage !== 'undefined' && typeof mainImage.asset !== 'undefined') {
    srcSet =
      urlFor(ensure(mainImage.asset)._ref)
        .format('webp')
        .width(2000)
        .fit('max')
        .url() || '';
    src =
      urlFor(ensure(mainImage.asset)._ref)
        .width(150)
        .height(150)
        .fit('max')
        .url() || '';
  }

  return page ? (
    <section className={classes.page}>
      {mainImage && mainImage.asset && mainImage.asset._ref && (
        <picture className={classes.pageMainImageContainer}>
          <source type="image/webp" srcSet={srcSet || ''} />
          <img src={src || ''} alt={mainImage.alt} />
        </picture>
      )}
      <div className={classes.pageContentWrapper}>
        <div className={classes.pageContent}>
          <h1 className={classes.pageTitle}>{page.title}</h1>
          <ul className={classes.pageAuthorList}>
            {page.authors &&
              authorList.map((author: AuthorModel) => {
                return (
                  <li key={`${author.slug.current}`}>
                    <AuthorCard author={author} />
                  </li>
                );
              })}
          </ul>
          {page.body && (
            <div className={classes.pageContent}>
              <Blocks body={page.body} />
            </div>
          )}
        </div>
      </div>
    </section>
  ) : null;
};
