import React, { useMemo } from 'react';

// Styles
import classes from './CategoryCard.module.scss';
import { urlFor } from '../../services/SanityService';
import { Link } from '../Link/Link';
import { CategoryModel } from '../../redux/modules/categories';
import useSelector from '../../redux/typedHooks';
import { ensure } from '../../lib/ensure';

// Types
interface CategoryProps {
  category: CategoryModel;
  language: string;
}

export const Category = ({ category, language }: CategoryProps) => {
  const { ingress, title, mainImage } = category;

  const categories = useSelector((state) => state.categories.data);
  const categoryIdMap = useMemo(
    () =>
      Object.values(categories).reduce((acc: Record<CategoryModel['_id'], CategoryModel>, cur) => {
        acc[cur._id] = cur;
        return acc;
      }, {}),
    [categories],
  );

  const urlCreator = (currentUrl: string, currentCategory: CategoryModel): string => {
    if (currentCategory.slug.current === 'categories') {
      return `${currentUrl}`;
    }
    return `${urlCreator(
      `${currentCategory.slug.current}/${currentUrl}`,
      categoryIdMap[currentCategory.parent._ref],
    )}`;
  };

  const currentUrl = useMemo(() => urlCreator('', category), [category, categoryIdMap]);

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
      {category && mainImage && mainImage.asset && mainImage.asset._ref && (
        <Link to={`/${language}/${currentUrl}`}>
          <picture className={classes.postImage}>
            <source type="image/webp" srcSet={srcSet} />
            <img src={src} alt="" />
          </picture>
        </Link>
      )}
      <Link
        className={classes.postLink}
        to={`/${language}/${currentUrl}`}
        aria-label={category.title}
      >
        <h2 className={classes.postTitle}>{title}</h2>
      </Link>
      {ingress && <small className={classes.postIngress}>{ingress}</small>}
    </div>
  );
};
