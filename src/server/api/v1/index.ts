import { Router } from 'express';

const api = Router();

api.get('/documents/:documentSlug', async (req, res) => {
  const [result] = await req.app.services.SanityService.getDocumentBySlug(req.params.documentSlug);
  res.send(result);
});

export { api };
