import { useEffect, useMemo, useState } from 'react';
import useSelector from '../redux/typedHooks';
import { CategoryModel } from '../redux/modules/categories';

export const useCategoryUrl = (categoryId?: CategoryModel['_id'], slug?: string): string => {
  const [url, setUrl] = useState('');
  const categories = useSelector((state) => state.categories.data);
  const categoryIdMap = useMemo(
    () =>
      Object.values(categories).reduce((acc: Record<CategoryModel['_id'], CategoryModel>, cur) => {
        acc[cur._id] = cur;
        return acc;
      }, {}),
    [categories, categoryId, slug],
  );

  const urlCreator = (currentUrl: string, currentCategoryId: CategoryModel['_id']): string => {
    const currentCategory = categoryIdMap[currentCategoryId];
    if (
      !!currentCategory &&
      !!currentCategory.slug &&
      currentCategory.slug.current === 'categories'
    ) {
      return `${currentUrl}`;
    }
    return (
      !!currentCategory &&
      !!currentCategory.slug &&
      `${urlCreator(`${currentCategory.slug.current}/${currentUrl}`, currentCategory.parent._ref)}`
    );
  };

  useEffect(() => {
    const calculatedUrl = urlCreator(slug || '', categoryId || '');
    setUrl(calculatedUrl);
  }, [categoryId, slug, categoryIdMap]);
  return url;
};
