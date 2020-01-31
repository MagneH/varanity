import { Router } from 'express';
import { SanityDocument } from '@sanity/client';
import url from 'url';

const dataFetchRouter = Router();

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
  console.log(templates);
  req.app.initialTemplateData = templates[0].templateSet.reduce(
    (acc: Record<SanityDocument['_type'], SanityDocument>, cur: SanityDocument) => {
      acc[cur._type] = cur;
      return acc;
    },
    {},
  );
  const pages = await req.app.services.SanityService.getAllPages();
  console.log(pages);
  req.app.initialDocumentData = pages.reduce(
    (acc: Record<SanityDocument['slug']['current'], SanityDocument>, cur: SanityDocument) => {
      acc[cur.slug.current] = cur;
      return acc;
    },
    {},
  );

  return next();
});

dataFetchRouter.get('/:language/pages/:pageSlug', async (req, res, next) => {
  // req.app.isPreview = false;
  // const { pageSlug } = req.params;
  // if (pageSlug && typeof pageSlug === 'string') {
  //   req.app.initialDocumentData = {};
  //   [
  //     req.app.initialDocumentData[pageSlug],
  //   ] = await req.app.services.SanityService.getDocumentBySlug(pageSlug);
  // }
  next();
});

dataFetchRouter.get('/:language/articles/:articleSlug', async (req, res, next) => {
  req.app.isPreview = false;
  const { articleSlug } = req.params;
  if (articleSlug && typeof articleSlug === 'string') {
    req.app.initialDocumentData = {...req.app.initialDocumentData};
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
    req.app.initialDocumentData = {...req.app.initialDocumentData};
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
    req.app.initialDocumentData = {...req.app.initialDocumentData};
    const page = await req.app.services.SanityService.getDocumentById(pageId, queryData.isDraft);
    req.app.initialDocumentData[page._id] = page;
  }
  next();
});

export { dataFetchRouter };