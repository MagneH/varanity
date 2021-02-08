import { SanityDocument } from '@sanity/client';

export const handleArticles: (req: any, res: any, next: any) => void = async (req, res, next) => {
  try {
    const articleResponse: SanityDocument[] = await req.app.services.SanityService.getArticleBySlug(
      req.params.slug,
    );
    req.app.initialArticlesData = {
      mappedData: articleResponse.reduce(
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
};
