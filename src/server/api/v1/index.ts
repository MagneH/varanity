import { Router } from 'express';

const api = Router();

api.get('/document/:documentSlug', async (req, res, next) => {
  try {
    const [result] = await req.app.services.SanityService.getArticleBySlug(req.params.documentSlug);
    res.send(result);
  } catch (e) {
    next();
    // TODO: Improve error handling
  }
});

api.get('/documents/:categorySlug', async (req, res, next) => {
  try {
    const result = await req.app.services.SanityService.getArticlesByCategorySlug(
      req.params.categorySlug,
    );
    res.send(result);
  } catch (e) {
    next();
    // TODO: Improve error handling
  }
});

export { api };
