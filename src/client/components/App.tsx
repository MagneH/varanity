import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import Helmet from 'react-helmet';
import { Route, Switch } from 'react-router';
import favicon from '../../assets/favicon.ico';
import NavBar from './NavBar';

// Pages
import { Home } from '../pages/Home';
import { Examples, Examples as Example } from '../pages/Examples';
import { NotFound } from '../pages/errors/NotFound';
import { Footer } from './Footer';

export const App = hot(() => {
  return (
    <div className="App">
      <Helmet>
        <html lang="en" />
        <title itemProp="name" lang="en">
          Varan
        </title>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="A varan react starter app" />
        <meta name="og:type" content="website" />
        <meta name="theme-color" content="#59C3C3" />
        <link rel="icon" href={favicon} />
      </Helmet>
      <div className="AppContainer">
        <NavBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/examples" component={Examples} />
          <Route path="/examples/:example" component={Example} />
          <Route component={NotFound} />
        </Switch>
        <Footer />
      </div>
    </div>
  );
});
