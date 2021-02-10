import { Router } from 'express';

const api = Router();

api.get('/document/:documentSlug', async (req, res) => {
  const [result] = await req.app.services.SanityService.getArticleBySlug(req.params.documentSlug);
  res.send(result);
});

api.get('/documents/:categorySlug', async (req, res) => {
  const result = await req.app.services.SanityService.getArticlesByCategorySlug(
    req.params.categorySlug,
  );
  res.send(result);
});

export { api };
