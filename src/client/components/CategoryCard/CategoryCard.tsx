import React, { useMemo } from 'react';

// Styles
import classes from './CategoryCard.module.scss';
import { urlFor } from '../../services/SanityService';
import { ArticleModel } from '../../pages/Article';
import { Link } from '../Link/Link';
import { CategoryModel } from '../../redux/modules/categories';
import useSelector from '../../redux/typedHooks';

// Types
interface CategoryProps {
  category: CategoryModel;
  language: string;
}

export const Category = ({ category, language }: CategoryProps) => {
  const { ingress, title, mainImage, slug, parent } = category;

  const categories = useSelector(state => state.categories.data);
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

  return (
    <div className={classes.post}>
      {category && mainImage && mainImage.asset && mainImage.asset._ref && (
        <Link to={`/${language}/${currentUrl}`}>
          <picture className={classes.postImage}>
            <source
              type="image/webp"
              srcSet={
                urlFor(mainImage)
                  .withOptions(mainImage)
                  .format('webp')
                  .width(300)
                  .height(250)
                  .fit('max')
                  .url() || undefined
              }
            />
            <img
              src={
                urlFor(mainImage)
                  .withOptions(mainImage)
                  .width(150)
                  .height(150)
                  .fit('max')
                  .url() || undefined
              }
              alt=""
            />
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
