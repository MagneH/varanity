import React, { Dispatch, ReactElement, SetStateAction, useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { Helmet } from 'react-helmet-async';
import { Route, Switch, useLocation, Redirect } from 'react-router';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import ReactGA from 'react-ga';
import ttiPolyfill from 'tti-polyfill';
import { ToastContainer } from 'react-toastify';
import favicon from '../../../assets/favicon.ico';
import { Navbar } from '../Navbar/Navbar';
import { Footer } from '../Footer/Footer';

// Styles
import classes from './App.module.scss';

// Manifests
import webmanifest from '../../../assets/manifest.webmanifest';

// Pages
import { Home } from '../../pages/Home/Home';
import { Page, PageProps } from '../../pages/Page';
import { Article, ArticleProps } from '../../pages/Article';
import 'react-toastify/dist/ReactToastify.css';
import useSelector from '../../redux/typedHooks';
import { ArticleList } from '../../pages/ArticleList';

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('asd-123', { testMode: process.env.NODE_ENV !== 'production' });
}

// Exports
export const App = hot(() => {
  const location = useLocation();
  return (
    <div className={classes.app}>
      <Helmet titleTemplate="%s | Varan">
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="A varan react starter app" />
        <meta name="og:type" content="website" />
        <meta name="theme-color" content="#59C3C3" />
        <link rel="icon" href={favicon} />
        <link rel="manifest" href={webmanifest} />
      </Helmet>
      <ToastContainer />
      <TransitionGroup>
        <CSSTransition
          key={location.key}
          classNames={{
            enterActive: classes.appPageContentEnterActive,
            exitActive: classes.appPageContentExitActive,
          }}
          timeout={200}
          className={classes.appPageContent}
        >
          <div className={classes.appPageContent}>
            <Switch>
              <Route
                path="/:language"
                component={({
                  match: languageMatch,
                  history,
                }: {
                  match: { path: string; params: { language: string } };
                  history: History;
                  location: Location;
                }) => {
                  const {
                    params: { language },
                  } = languageMatch;
                  return (
                    <LanguageRouter
                      language={language}
                      languageMatch={languageMatch}
                      history={history}
                    />
                  );
                }}
              />
              <Route exact path="/" component={Home}>
                <Redirect to="/en" />
              </Route>
            </Switch>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
});

interface LanguageRouterProps {
  language: string;
  languageMatch: any;
  history: History & { listen?: (cb: (location: Location) => any) => () => void };
}

export const TrackerContext = React.createContext<{
  initialLoadedProp: boolean;
  setInitialLoadedProp: Dispatch<SetStateAction<boolean>>;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
}>({ initialLoadedProp: false, setInitialLoadedProp: () => {} });

interface PreviewProps {
  match: {
    path: any;
  };
}

const PreviewRouter = ({ match }: PreviewProps) => {
  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Route
        path={`${match.path}/pages/:id`}
        component={({ isDraft, location, history, match: pagePreviewMatch, language, slug }: PageProps) => {
          return (
            <Page
              isDraft={isDraft}
              location={location}
              history={history}
              match={pagePreviewMatch}
              language={language}
              slug={slug}
              isPreview
            />
          );
        }}
      />
      <Route
        path={`${match.path}/articles/:id`}
        component={({
                    isDraft,
                    location,
                    history,
                    match: articlePreviewMatch,
                    language,
                    slug}: ArticleProps) => (
          <Article
            isDraft={isDraft}
            location={location}
            history={history}
            match={articlePreviewMatch}
            language={language}
            slug={slug}
            isPreview
          />
        )}
      />
    </>
  )};

const LanguageRouter = ({ language, languageMatch, history }: LanguageRouterProps) => {
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    if (history && history.listen) {
      return history.listen(newLocation => {
        ReactGA.set({ page: newLocation.pathname });
        ReactGA.pageview(newLocation.pathname);
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, []);

  useEffect(() => {
    const callback = (list: PerformanceObserverEntryList) => {
      (list.getEntries() as PerformanceNavigationTiming[]).forEach(entry => {
        ReactGA.timing({
          category: 'Load Performace',
          variable: 'Server Latency',
          value: entry.responseStart - entry.requestStart,
        });
        ReactGA.timing({
          category: 'Load Performace',
          variable: 'Download time',
          value: entry.responseEnd - entry.responseStart,
        });
        ReactGA.timing({
          category: 'Load Performace',
          variable: 'Total app load time',
          value: entry.responseEnd - entry.requestStart,
        });
      });
    };

    if (typeof PerformanceObserver !== 'undefined') {
      const observer = new PerformanceObserver(callback);
      observer.observe({ entryTypes: ['navigation'] });
      return () => observer.disconnect();
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, []);

  useEffect(() => {
    ttiPolyfill.getFirstConsistentlyInteractive().then(tti => {
      if (tti) {
        ReactGA.timing({
          category: 'Load Performace',
          variable: 'Time to Interactive',
          value: tti,
        });
      }
    });
  });

  return (
    <TrackerContext.Provider
      value={{
        initialLoadedProp: initialLoaded,
        setInitialLoadedProp: () => setInitialLoaded(true),
      }}
    >
      <Navbar language={language} />
      <Switch>
        <Route
          exact
          path={`${languageMatch.path}/`}
          component={({
            location: routeLocation,
          }: {
            match: { params: any };
            location: Location;
            language: string;
          }) => {
            return <Home language={language} location={routeLocation} />;
          }}
        />
        <Route
          path={`${languageMatch.path}/pages/:pageSlug`}
          component={({
            match: pageMatch,
            location: routeLocation,
          }: {
            match: { params: any };
            location: Location;
          }) => {
            return (
              <Page
                language={language}
                match={pageMatch}
                location={routeLocation}
                history={history}
                slug={pageMatch.params.pageSlug}
              />
            );
          }}
        />
        <Route
          path={`${languageMatch.path}/articles/:articleSlug`}
          component={({
            match: articleMatch,
            location: routeLocation,
          }: {
            match: { params: any };
            location: Location;
          }) => {
            return (
              <Article
                language={language}
                match={articleMatch}
                location={routeLocation}
                history={history}
                slug={articleMatch.params.articleSlug}
              />
            );
          }}
        />
        <Route
          path={`${languageMatch.path}/preview`}
          component={({ match: previewMatch }: { match: { path: any }; location: Location }) => {
            return <PreviewRouter match={previewMatch} />;
          }}
        />
        <Route
          path="/*/:slug"
          component={({
            location: routeLocation,
            match: slugMatch,
            match: {
              params: { slug },
            },
          }: {
            match: { params: { slug: string } };
            location: Location;
          }): ReactElement => {
            // Check if this route is a subcategory, if not, forward to article
            const categoryTree = useSelector(state => state.categories);
            if (
              categoryTree &&
              categoryTree.data &&
              Object.keys(categoryTree.data).includes(slug)
            ) {
              return (
                <ArticleList
                  language={language}
                  match={slugMatch}
                  location={routeLocation}
                  history={history}
                  slug={slug}
                />
              );
            }
            return (
              <Article
                language={language}
                match={slugMatch}
                location={routeLocation}
                history={history}
                slug={slug}
              />
            );
          }}
        />
      </Switch>
      <Footer language={language} />
    </TrackerContext.Provider>
  );
};
