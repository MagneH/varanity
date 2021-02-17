import { Router } from 'express';
import { SanityDocument } from '@sanity/client';
import url from 'url';
import { handleCategories } from './handleCategories';

const dataFetchRouter = Router();

dataFetchRouter.use((req, res, next) => {
  handleCategories(req, res, next);
});

dataFetchRouter.use(async (req, res, next) => {
  try {
    const authorsRequest = req.app.services.SanityService.getAllAuthors();
    const templateRequest = req.app.services.SanityService.getAllTemplateDocuments();
    const pagesRequest = req.app.services.SanityService.getAllPages();

    const jobs = [authorsRequest, templateRequest, pagesRequest];

    const results = await Promise.all(jobs);

    req.app.initialAuthorData = results[0].reduce(
      (acc: Record<SanityDocument['_id'], SanityDocument>, cur: SanityDocument) => {
        acc[cur._id] = cur;
        return acc;
      },
      {},
    );
    req.app.initialTemplateData = results[1][0].templateSet.reduce(
      (acc: Record<SanityDocument['_type'], SanityDocument>, cur: SanityDocument) => {
        acc[cur._type] = cur;
        return acc;
      },
      {},
    );
    req.app.initialPageData = {
      ...req.app.initialPageData,
      ...results[2].reduce(
        (acc: Record<SanityDocument['slug']['current'], SanityDocument>, cur: SanityDocument) => {
          acc[cur.slug.current] = cur;
          return acc;
        },
        {},
      ),
    };
    // eslint-disable-next-line no-empty
  } catch (e) {
    // TODO: Improve error handling
  }
  try {
    const featuredArticles = await req.app.services.SanityService.getFeaturedArticles();
    const articles = await req.app.services.SanityService.getNewestArticles();
    req.app.initialArticleData = {
      ...req.app.initialArticleData,
      ...[...articles, ...featuredArticles].reduce(
        (acc: Record<SanityDocument['slug']['current'], SanityDocument>, cur: SanityDocument) => {
          acc[cur.slug.current] = { ...cur };
          return acc;
        },
        {},
      ),
    };
  } catch (e) {
    // TODO: Improve error handling
  }

  return next();
});

dataFetchRouter.get('/:language/articles/:articleSlug', async (req, res, next) => {
  req.app.isPreview = false;
  const { articleSlug } = req.params;
  try {
    if (articleSlug && typeof articleSlug === 'string') {
      req.app.initialDocumentData = { ...req.app.initialDocumentData };
      [
        req.app.initialDocumentData[articleSlug],
      ] = await req.app.services.SanityService.getArticleBySlug(articleSlug);
    }
  } catch (e) {
    // TODO: Improve error handling
  }
  next();
});

dataFetchRouter.get('/:language/preview/articles/:articleId', async (req, res, next) => {
  req.app.isPreview = true;
  const { articleId } = req.params;
  const queryData = await url.parse(req.url, true).query;
  try {
    if (queryData && typeof queryData.isDraft !== 'undefined') {
      req.app.initialDocumentData = { ...req.app.initialDocumentData };
      const article = await req.app.services.SanityService.getDocumentById(
        articleId,
        queryData.isDraft,
      );
      req.app.initialDocumentData[article._id] = article;
    }
  } catch (e) {
    // TODO: Improve error handling
  }
  next();
});

dataFetchRouter.get('/:language/preview/pages/:pageId', async (req, res, next) => {
  req.app.isPreview = true;
  const { pageId } = req.params;
  const queryData = await url.parse(req.url, true).query;
  try {
    if (queryData && typeof queryData.isDraft !== 'undefined') {
      req.app.initialDocumentData = { ...req.app.initialDocumentData };
      const page = await req.app.services.SanityService.getDocumentById(pageId, queryData.isDraft);
      req.app.initialDocumentData[page._id] = page;
    }
  } catch (e) {
    // TODO: Improve error handling
  }
  next();
});

dataFetchRouter.get(`/*/:slug`, handleCategories);

dataFetchRouter.get(`/:slug`, handleCategories);

export { dataFetchRouter };
