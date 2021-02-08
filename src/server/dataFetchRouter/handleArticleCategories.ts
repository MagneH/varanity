import { SanityDocument } from '@sanity/client';
import { handleArticles } from './handleArticles';

export const handleCategories: (req: any, res: any, next: any) => void = async (req, res, next) => {
  // Lets check if categories exist, if it does not, or we do not have data to verify with, we assume it is an articleslug and skip to next route.
  if (typeof req.app.initialSiteStructureData !== 'undefined') {
    const categories = req.app.initialSiteStructureData.mappedCategories;
    // TODO: Need some query/filter handling eventually
    const categorySlug = req.params.slug;
    if (categories && !Object.keys(categories).includes(categorySlug)) {
      handleArticles(req, res, next);
    } else {
      try {
        const articleResponse: SanityDocument[] = await req.app.services.SanityService.getArticleByCategorySlug(
          categorySlug,
        );
        req.app.initialArticlesData = {
          ...req.app.initialArticlesData,
          ...articleResponse.reduce(
            (acc: Record<SanityDocument['slug']['current'], SanityDocument>, cur) => {
              acc[cur.slug.current] = cur;
              return acc;
            },
            {},
          ),
        };
      } catch (e) {
        // TODO: log error with azure logging library;
      }
      next();
    }
  }
};
