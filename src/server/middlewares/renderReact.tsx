import React from 'react';
import { RequestHandler } from 'express';
import { renderToStaticMarkup } from 'react-dom/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import { HelmetProvider, FilledContext } from 'react-helmet-async';
import { StaticRouter } from 'react-router';
import { Provider } from 'react-redux';
import { createLocation } from 'history';
import fetch from 'cross-fetch';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { getDataFromTree } from '@apollo/client/react/ssr';
import { createStore } from '../../client/redux/createStore';
import { App } from '../../client/components/App/App';
import { Html } from '../components/Html';

// Types
interface ApplicationStats {
  assetsByChunkName: {
    [bundle: string]: string | string[];
  };
}
interface ApplicationAsset {
  src: string;
  integrity?: string;
}
interface ApplicationAssets {
  [file: string]: ApplicationAsset;
}

// Add hot reloading
if (module.hot) {
  module.hot.accept('../../client/components/App/App', () => {
    /* empty */
  });
}

// Init
function getApplicationAsset(asset: string | ApplicationAsset) {
  return typeof asset === 'string'
    ? { src: asset }
    : { src: asset.src, integrity: (!module.hot && asset.integrity) || undefined };
}

// Exports
export default (
  stats: ApplicationStats,
  assets: ApplicationAssets,
  preload: string[] = [],
): RequestHandler => {
  // Load assets
  const { bundleJs, bundleCss } = Object.entries(stats.assetsByChunkName).reduce<{
    bundleJs: ApplicationAsset[];
    bundleCss: ApplicationAsset[];
  }>(
    (acc, [k, v]) => {
      (Array.isArray(v) ? v : [v]).forEach((f) => {
        if (f.endsWith('.js')) acc.bundleJs.push(getApplicationAsset(assets[`${k}.js`]));
        else if (f.endsWith('.css')) acc.bundleCss.push(getApplicationAsset(assets[`${k}.css`]));
      });
      return acc;
    },
    { bundleJs: [], bundleCss: [] },
  );

  // Fetch preloaded assets
  const preloadedAssets = preload.map((f) => assets[f]);

  // Return react rendering middleware
  return async function renderReact(req, res) {
    // Prepare
    const initialState = {
      application: { isOffline: false },
      documents: { data: {} },
      previews: { data: {} },
      templates: { data: {} },
      authors: { data: {} },
      categories: { ...{ data: {} }, ...req.app.initialCategoryData },
    };
    // eslint-disable-next-line no-underscore-dangle
    if (req.app.isPreview === true && req.app.initialDocumentData) {
      // eslint-disable-next-line no-underscore-dangle
      initialState.previews.data = req.app.initialDocumentData;
    }

    if (req.app.initialTemplateData) {
      initialState.templates.data = req.app.initialTemplateData;
    }

    if (req.app.initialAuthorData) {
      initialState.authors.data = req.app.initialAuthorData;
    }

    if (req.app.initialPageData) {
      initialState.documents.data = { ...initialState.documents.data, ...req.app.initialPageData };
    }

    if (req.app.initialArticleData) {
      initialState.documents.data = {
        ...initialState.documents.data,
        ...req.app.initialArticleData,
      };
    }

    const { store } = createStore({
      ...initialState,
      router: { location: createLocation(req.originalUrl) },
    });

    // Render
    const helmetContext = {};
    const routerContext: {
      url?: string;
      statusCode?: number;
    } = {};

    const sheet = new ServerStyleSheet();

    const client = new ApolloClient({
      ssrMode: true,
      link: createHttpLink({
        uri: 'https://bq0ivwom.api.sanity.io/v1/graphql/production/default',
        fetch,
      }),
      cache: new InMemoryCache(),
    });

    const AppTree = (
      <ApolloProvider client={client}>
        <StyleSheetManager sheet={sheet.instance}>
          <Provider store={store}>
            <HelmetProvider context={helmetContext}>
              <StaticRouter location={req.url} context={routerContext}>
                <App />
              </StaticRouter>
            </HelmetProvider>
          </Provider>
        </StyleSheetManager>
      </ApolloProvider>
    );

    const body = await getDataFromTree(AppTree);
    // Extract the entirety of the Apollo Client cache's current state
    const initialApolloState = client.extract();

    // Add both the page content and the cache state to a top-level component

    // Render the component to static markup and return i

    const { helmet } = helmetContext as FilledContext;
    const html = `<!DOCTYPE html>${renderToStaticMarkup(
      <Html
        htmlAttributes={helmet.htmlAttributes.toComponent()}
        bodyAttributes={helmet.bodyAttributes.toComponent()}
        title={helmet.title.toComponent()}
        meta={helmet.meta.toComponent()}
        link={helmet.link.toComponent()}
        style={
          <>
            {helmet.style.toComponent()}
            {sheet.getStyleElement()}
          </>
        }
        script={helmet.script.toComponent()}
        noscript={helmet.noscript.toComponent()}
        base={helmet.base.toComponent()}
        body={body}
        bundleJs={bundleJs}
        bundleCss={bundleCss}
        preload={preloadedAssets}
        initialState={initialState}
        initialApolloState={initialApolloState}
      />,
    )}`;

    sheet.seal();

    if (routerContext.url) {
      if (routerContext.statusCode !== undefined) res.status(routerContext.statusCode);
      res.redirect(routerContext.url);
      return;
    }
    if (routerContext.statusCode) res.status(routerContext.statusCode);
    res.send(html);
  };
};
