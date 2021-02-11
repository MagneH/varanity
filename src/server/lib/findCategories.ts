export const findCategoriesByProperty = (
  obj: Record<string, string[]>,
  property: string,
  parentList?: Record<string, { url: string }>,
  parent?: string,
): Record<string, any> => {
  let items: Record<string, any> = {};
  if (!obj[property]) return items;

  obj[property].map((category: any) => {
    const url =
      parentList && parent
        ? `${parentList[parent].url}/${category.slug.current}`
        : `/${category.slug.current}`;

    items[category.slug.current] = {
      url,
      image: category.image,
      title: category.title,
      slug: category.slug,
    };

    if (category[property] && category[property].length > 0) {
      const subCategories = findCategoriesByProperty(
        category,
        property,
        items,
        category.slug.current,
      );
      items = Object.assign(items, subCategories);
    }
    return items;
  });
  return items;
};
