import * as React from 'react';
import { HTMLAttributes } from 'react';
import serialize from 'serialize-javascript';

// Interface
export interface Asset {
  src: string;
  integrity?: string;
}
export interface HtmlProps {
  title: React.ReactNode;
  meta: React.ReactNode;
  link: React.ReactNode;
  style: React.ReactNode;
  script: React.ReactNode;
  noscript: React.ReactNode;
  base: React.ReactNode;
  htmlAttributes?: HTMLAttributes<HTMLHtmlElement>;
  bodyAttributes?: HTMLAttributes<HTMLBodyElement>;
  bundleJs: (string | Asset)[];
  bundleCss: (string | Asset)[];
  body?: string;
  initialState?: Record<string, unknown>;
  manifest?: string | Asset;
  preload?: (string | Asset)[];
  baseUrl?: string;
  initialApolloState?: Record<string, unknown>;
}

// Helpers
function isAssetObject(asset: string | Asset): asset is Asset {
  return typeof asset === 'object';
}

// Exports
export const Html = ({
  htmlAttributes = {},
  bodyAttributes = {},
  title,
  meta,
  link,
  style,
  script,
  noscript,
  base,
  body = '',
  bundleJs,
  bundleCss,
  initialState,
  manifest,
  preload = [],
  baseUrl = '/',
  initialApolloState,
}: HtmlProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <html lang="en" {...htmlAttributes}>
    <head>
      {baseUrl && <base href={baseUrl} />}
      {title}
      {meta}
      {noscript}
      {base}
      {manifest &&
        (isAssetObject(manifest) ? (
          <link
            rel="manifest"
            href={manifest.src}
            integrity={manifest.integrity}
            crossOrigin="use-credentials"
          />
        ) : (
          <link rel="manifest" href={manifest} crossOrigin="use-credentials" />
        ))}
      {link}
      {preload.map((asset) => {
        const { src, integrity = undefined } = isAssetObject(asset) ? asset : { src: asset };
        if (/\.js$/.test(src)) {
          return (
            <link
              key={src}
              href={src}
              rel="preload"
              as="script"
              integrity={integrity}
              crossOrigin="use-credentials"
            />
          );
        }
        if (/\.css$/.test(src)) {
          return (
            <link
              key={src}
              href={src}
              rel="preload"
              as="style"
              integrity={integrity}
              crossOrigin="use-credentials"
            />
          );
        }
        if (/(\.woff|\.woff2|\.eot|\.ttf)$/.test(src)) {
          return (
            <link
              key={src}
              href={src}
              rel="preload"
              as="font"
              integrity={integrity}
              crossOrigin="use-credentials"
            />
          );
        }
        if (/(\.png|\.jpe?g|\.gif)$/.test(src)) {
          return (
            <link
              key={src}
              href={src}
              rel="preload"
              as="image"
              integrity={integrity}
              crossOrigin="use-credentials"
            />
          );
        }
        return null;
      })}
      {bundleCss.map((css) =>
        isAssetObject(css) ? (
          <link
            key={css.src}
            integrity={css.integrity}
            href={css.src}
            rel="stylesheet"
            crossOrigin="use-credentials"
          />
        ) : (
          <link key={css} href={css} rel="stylesheet" crossOrigin="use-credentials" />
        ),
      )}
      {style}
      {script}
    </head>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <body {...bodyAttributes}>
      {/* eslint-disable-next-line react/no-danger */}
      <div id="root" dangerouslySetInnerHTML={{ __html: body }} />
      {initialState && (
        <script
          id="initial-state"
          type="text/javascript"
          /* eslint-disable-next-line react/no-danger */
          dangerouslySetInnerHTML={{
            __html: `window.__INITIAL_REDUX_STATE__ = ${serialize(initialState, {
              isJSON: true,
            })}`,
          }}
        />
      )}
      {initialApolloState && (
        <script
          /* eslint-disable-next-line react/no-danger */
          dangerouslySetInnerHTML={{
            __html: `window.__APOLLO_STATE__=${JSON.stringify(initialApolloState).replace(
              /</g,
              '\\u003c',
            )};`,
          }}
        />
      )}
      {bundleJs.map((js) =>
        isAssetObject(js) ? (
          <script
            key={js.src}
            type="text/javascript"
            src={js.src}
            integrity={js.integrity}
            defer
            crossOrigin="use-credentials"
          />
        ) : (
          <script key={js} type="text/javascript" src={js} defer crossOrigin="anonymous" />
        ),
      )}
    </body>
  </html>
);
