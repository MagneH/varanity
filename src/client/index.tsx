// Polyfills
import 'focus-visible';

import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { HelmetProvider } from 'react-helmet-async';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import fetch from 'cross-fetch';
import { store, history } from './redux/store';
import { App } from './components/App/App';

// Global Styles
import 'normalize.css';
import './styles/global.scss';

const client = new ApolloClient({
  uri: 'https://bq0ivwom.api.sanity.io/v1/graphql/production/default',
  link: createHttpLink({
    uri: 'https://bq0ivwom.api.sanity.io/v1/graphql/production/default',
    fetch,
  }),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  cache: new InMemoryCache().restore(
    window && '__APOLLO_STATE__' in window ? (window as any).__APOLLO_STATE__ : {},
  ),
});

// Render app
const render = () =>
  hydrate(
    <ApolloProvider client={client}>
      <Provider store={store}>
        <HelmetProvider>
          <ConnectedRouter history={history}>
            <App />
          </ConnectedRouter>
        </HelmetProvider>
      </Provider>
    </ApolloProvider>,
    document.getElementById('root'),
  );
render();

// Enable hot reloading
if (module.hot) module.hot.accept('./components/App/App', render);
