import { SanityDocument } from '@sanity/client';

export const handleCategories: (req: any, res: any, next: any) => void = async (req, res, next) => {
  try {
    const urlStructureResponse: SanityDocument[] = await req.app.services.SanityService.getCategories();
    const mappedCategories = urlStructureResponse.reduce(
      (acc: Record<SanityDocument['slug']['current'], SanityDocument>, cur: SanityDocument) => {
        acc[cur.slug.current] = cur;
        return acc;
      },
      {},
    );

    req.app.initialCategoryData = {
      data: mappedCategories,
    };
  } catch (e) {
    // TODO: log error with azure logging library;
  }
  next();
};
