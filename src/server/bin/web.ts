// Init environment
import 'source-map-support/register';
import dotenv from 'dotenv';

import express from 'express';
import compression from 'compression';
import fs from 'fs';
import path from 'path';
import gzipStatic from 'express-static-gzip';
import renderReact from '../middlewares/renderReact';
import { services } from '../services';
import { Service } from '../services/Service';
import { api } from '../api/v1';
import { dataFetchRouter } from '../dataFetchRouter';

dotenv.config();

// Hot reloading
if (module.hot) {
  module.hot.accept('../middlewares/renderReact', () => {
    /* empty */
  });
}

// Enable preloading of files that is highly likely to be used e.g fonts (will map to the webpack hashed file name)
const PRELOAD_FILES = [
  'static/media/open-sans-v15-latin-ext_latin-300.woff2',
  'static/media/open-sans-v15-latin-ext_latin-600.woff2',
  'static/media/open-sans-v15-latin-ext_latin-700.woff2',
  'static/media/open-sans-v15-latin-ext_latin-regular.woff2',
];

// Init

async function main() {
  const app = express();
  app.set('env', process.env.NODE_ENV || 'production');
  app.set('host', process.env.HOST);
  app.set('port', (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000);
  const CLIENT_FILES = path.resolve(__dirname, process.env.VARAN_CLIENT_ROOT || '../../client');
  const CLIENT_FILES_CACHE_AGE = app.get('env') === 'production' ? 86400000 * 365 : undefined;
  const stats =
    process.env.VARAN_STATS_MANIFEST &&
    JSON.parse(
      fs.readFileSync(path.resolve(__dirname, process.env.VARAN_STATS_MANIFEST)).toString(),
    );
  const assets =
    process.env.VARAN_ASSETS_MANIFEST &&
    JSON.parse(
      fs.readFileSync(path.resolve(__dirname, process.env.VARAN_ASSETS_MANIFEST)).toString(),
    );

  const initializedServices = Object.keys(services).reduce(
    (
      acc: { services: Record<string, Service>; initializationStatus: Record<string, string> },
      cur,
    ) => {
      acc.services[cur] = services[cur].init();
      acc.initializationStatus[cur] = services[cur].initialized.toString();
      return acc;
    },
    { services: {}, initializationStatus: {} },
  );

  app.request.app.services = initializedServices.services;

  // Log initialization status to console
  // eslint-disable-next-line no-console
  console.table(initializedServices.initializationStatus);

  // Serve static files and attempt to serve .gz files if found
  app.use('/service-worker.js', compression(), (req, res, next) => {
    res.setHeader('Cache-Control', 'max-age=0, no-cache, no-store, must-revalidate');
    return next();
  });
  app.use(
    gzipStatic(CLIENT_FILES, {
      index: false,
      enableBrotli: true,
      orderPreference: ['br', 'gz'],
      serveStatic: { maxAge: CLIENT_FILES_CACHE_AGE },
    }),
  );

  // Render react server side
  app.use(compression());

  app.use('/api/v1/', api);

  app.use('/', await dataFetchRouter);

  app.get('*', await renderReact(stats, assets, PRELOAD_FILES));

  // Export server
  app.listen(app.get('port'), app.get('host'), () => {
    if (process.send) process.send('ready');
    // eslint-disable-next-line no-console
    console.log(`Server listening on ${app.get('port')} in ${app.get('env')} mode`);
  });
}

main();
