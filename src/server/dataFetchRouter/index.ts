import { Router } from 'express';
import { SanityDocument } from '@sanity/client';
import url from 'url';
import { handleCategories } from './handleCategories';

const dataFetchRouter = Router();

dataFetchRouter.use((req, res, next) => {
  handleCategories(req, res, next);
});

dataFetchRouter.use(async (req, res, next) => {
  const authors = await req.app.services.SanityService.getAllAuthors();
  req.app.initialAuthorData = authors.reduce(
    (acc: Record<SanityDocument['_id'], SanityDocument>, cur: SanityDocument) => {
      acc[cur._id] = cur;
      return acc;
    },
    {},
  );
  const templates = await req.app.services.SanityService.getAllTemplateDocuments();
  req.app.initialTemplateData = templates[0].templateSet.reduce(
    (acc: Record<SanityDocument['_type'], SanityDocument>, cur: SanityDocument) => {
      acc[cur._type] = cur;
      return acc;
    },
    {},
  );
  const pages = await req.app.services.SanityService.getAllPages();
  req.app.initialPageData = {
    ...req.app.initialPageData,
    ...pages.reduce(
      (acc: Record<SanityDocument['slug']['current'], SanityDocument>, cur: SanityDocument) => {
        acc[cur.slug.current] = cur;
        return acc;
      },
      {},
    ),
  };

  const articles = await req.app.services.SanityService.getNewestArticles();
  req.app.initialArticleData = {
    ...req.app.initialArticleData,
    ...articles.reduce(
      (acc: Record<SanityDocument['slug']['current'], SanityDocument>, cur: SanityDocument) => {
        acc[cur.slug.current] = { ...cur, isOnFrontPage: true };
        return acc;
      },
      {},
    ),
  };

  return next();
});

dataFetchRouter.get('/:language/articles/:articleSlug', async (req, res, next) => {
  req.app.isPreview = false;
  const { articleSlug } = req.params;
  if (articleSlug && typeof articleSlug === 'string') {
    req.app.initialDocumentData = { ...req.app.initialDocumentData };
    [
      req.app.initialDocumentData[articleSlug],
    ] = await req.app.services.SanityService.getArticleBySlug(articleSlug);
  }
  next();
});

dataFetchRouter.get('/:language/preview/articles/:articleId', async (req, res, next) => {
  req.app.isPreview = true;
  const { articleId } = req.params;
  const queryData = await url.parse(req.url, true).query;
  if (queryData && typeof queryData.isDraft !== 'undefined') {
    req.app.initialDocumentData = { ...req.app.initialDocumentData };
    const article = await req.app.services.SanityService.getDocumentById(
      articleId,
      queryData.isDraft,
    );
    req.app.initialDocumentData[article._id] = article;
  }
  next();
});

dataFetchRouter.get('/:language/preview/pages/:pageId', async (req, res, next) => {
  req.app.isPreview = true;
  const { pageId } = req.params;
  const queryData = await url.parse(req.url, true).query;
  if (queryData && typeof queryData.isDraft !== 'undefined') {
    req.app.initialDocumentData = { ...req.app.initialDocumentData };
    const page = await req.app.services.SanityService.getDocumentById(pageId, queryData.isDraft);
    req.app.initialDocumentData[page._id] = page;
  }
  next();
});

dataFetchRouter.get(`/*/:slug`, handleCategories);

dataFetchRouter.get(`/:slug`, handleCategories);

export { dataFetchRouter };
