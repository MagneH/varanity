import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { createMemoryHistory } from 'history';
import { store } from '../../src/client/redux/store';
import { FEATURED_ARTICLES } from '../../src/client/pages/Home/FeaturedSection/FeaturedSection.query';

const mocks = [
  {
    request: {
      query: FEATURED_ARTICLES,
    },
    result: {
      data: {
        allArticle: [
          {
            mainCategory: {
              _id: '21dc80fc-84ec-47de-8710-e99ebae8661e',
              _type: 'category',
              _createdAt: '2020-01-31T14:33:55Z',
              _updatedAt: '2021-02-13T01:04:32Z',
              _rev: 'hfmSWbiN0AOX41hc21HaNB',
              _key: null,
              title: 'Economy',
              description: 'Economy Category',
              mainImage: {
                _key: null,
                _type: 'mainImage',
                caption: null,
                alt: 'economy alt',
                asset: {
                  _id: 'image-638a606cf08c7bed18fae6bfdfa57e9672b01578-2120x1414-jpg',
                  _type: 'sanity.imageAsset',
                  originalFilename: 'economy.jpg',
                  label: null,
                  title: null,
                  description: null,
                  sha1hash: '638a606cf08c7bed18fae6bfdfa57e9672b01578',
                  extension: 'jpg',
                  mimeType: 'image/jpeg',
                  size: 1378383,
                  assetId: '638a606cf08c7bed18fae6bfdfa57e9672b01578',
                  path:
                    'images/bq0ivwom/production/638a606cf08c7bed18fae6bfdfa57e9672b01578-2120x1414.jpg',
                  url:
                    'https://cdn.sanity.io/images/bq0ivwom/production/638a606cf08c7bed18fae6bfdfa57e9672b01578-2120x1414.jpg',
                  source: null,
                },
                hotspot: null,
                crop: null,
              },
              slug: {
                current: 'economy',
              },
            },
            mainImage: {
              _key: null,
              _type: 'mainImage',
              caption: null,
              alt: 'test',
              asset: {
                _id: 'image-d5ed9d253b8ddc39458c9fa927ff6b115cf99308-900x599-jpg',
                _type: 'sanity.imageAsset',
                originalFilename: 'fruktblomstring.jpg',
                label: null,
                title: null,
                description: null,
                sha1hash: 'd5ed9d253b8ddc39458c9fa927ff6b115cf99308',
                extension: 'jpg',
                mimeType: 'image/jpeg',
                size: 113699,
                assetId: 'd5ed9d253b8ddc39458c9fa927ff6b115cf99308',
                path:
                  'images/bq0ivwom/production/d5ed9d253b8ddc39458c9fa927ff6b115cf99308-900x599.jpg',
                url:
                  'https://cdn.sanity.io/images/bq0ivwom/production/d5ed9d253b8ddc39458c9fa927ff6b115cf99308-900x599.jpg',
                source: null,
              },
              hotspot: {
                _key: null,
                _type: 'sanity.imageHotspot',
                x: 0.405612244897959,
                y: 0.6954788593233623,
                height: 0.5875528021219704,
                width: 0.811224489795918,
              },
              crop: {
                _key: null,
                _type: 'sanity.imageCrop',
                top: 0,
                bottom: 0.010744739615652588,
                left: 0,
                right: 0.188775510204082,
              },
            },
            slug: {
              current: 'the-featured-article',
            },
            title: 'The Featured Article',
            ingress: {
              _key: null,
              _type: 'localeBlocks',
              enRaw: [
                {
                  _key: 'e5137a2c7fa1',
                  _type: 'block',
                  children: [
                    {
                      _key: 'da60e41e0308',
                      _type: 'span',
                      marks: [],
                      text:
                        'This is the first article, it is a lorem ipsum article, saying dores sit amet. It is a great article taking up lots of space. On the home page it is fetched through Apollo client , both server side and client side.',
                    },
                  ],
                  markDefs: [],
                  style: 'normal',
                },
              ],
            },
          },
          {
            mainCategory: {
              _id: '21dc80fc-84ec-47de-8710-e99ebae8661e',
              _type: 'category',
              _createdAt: '2020-01-31T14:33:55Z',
              _updatedAt: '2021-02-13T01:04:32Z',
              _rev: 'hfmSWbiN0AOX41hc21HaNB',
              _key: null,
              title: 'Economy',
              description: 'Economy Category',
              mainImage: {
                _key: null,
                _type: 'mainImage',
                caption: null,
                alt: 'economy alt',
                asset: {
                  _id: 'image-638a606cf08c7bed18fae6bfdfa57e9672b01578-2120x1414-jpg',
                  _type: 'sanity.imageAsset',
                  originalFilename: 'economy.jpg',
                  label: null,
                  title: null,
                  description: null,
                  sha1hash: '638a606cf08c7bed18fae6bfdfa57e9672b01578',
                  extension: 'jpg',
                  mimeType: 'image/jpeg',
                  size: 1378383,
                  assetId: '638a606cf08c7bed18fae6bfdfa57e9672b01578',
                  path:
                    'images/bq0ivwom/production/638a606cf08c7bed18fae6bfdfa57e9672b01578-2120x1414.jpg',
                  url:
                    'https://cdn.sanity.io/images/bq0ivwom/production/638a606cf08c7bed18fae6bfdfa57e9672b01578-2120x1414.jpg',
                  source: null,
                },
                hotspot: null,
                crop: null,
              },
              slug: {
                current: 'economy',
              },
            },
            mainImage: {
              _key: null,
              _type: 'mainImage',
              caption: null,
              alt: 'test',
              asset: {
                _id: 'image-d5ed9d253b8ddc39458c9fa927ff6b115cf99308-900x599-jpg',
                _type: 'sanity.imageAsset',
                originalFilename: 'fruktblomstring.jpg',
                label: null,
                title: null,
                description: null,
                sha1hash: 'd5ed9d253b8ddc39458c9fa927ff6b115cf99308',
                extension: 'jpg',
                mimeType: 'image/jpeg',
                size: 113699,
                assetId: 'd5ed9d253b8ddc39458c9fa927ff6b115cf99308',
                path:
                  'images/bq0ivwom/production/d5ed9d253b8ddc39458c9fa927ff6b115cf99308-900x599.jpg',
                url:
                  'https://cdn.sanity.io/images/bq0ivwom/production/d5ed9d253b8ddc39458c9fa927ff6b115cf99308-900x599.jpg',
                source: null,
              },
              hotspot: {
                _key: null,
                _type: 'sanity.imageHotspot',
                x: 0.405612244897959,
                y: 0.6954788593233623,
                height: 0.5875528021219704,
                width: 0.811224489795918,
              },
              crop: {
                _key: null,
                _type: 'sanity.imageCrop',
                top: 0,
                bottom: 0.010744739615652588,
                left: 0,
                right: 0.188775510204082,
              },
            },
            slug: {
              current: 'the-featured-article',
            },
            title: 'The Featured Article',
            ingress: {
              _key: null,
              _type: 'localeBlocks',
              enRaw: [
                {
                  _key: 'e5137a2c7fa1',
                  _type: 'block',
                  children: [
                    {
                      _key: 'da60e41e0308',
                      _type: 'span',
                      marks: [],
                      text:
                        'This is the first article, it is a lorem ipsum article, saying dores sit amet. It is a great article taking up lots of space. On the home page it is fetched through Apollo client, both server side and client side.',
                    },
                  ],
                  markDefs: [],
                  style: 'normal',
                },
              ],
            },
          },
        ],
      },
    },
  },
];

interface Props {
  children: JSX.Element | JSX.Element[] | null;
}
export const MockProviderWrapper = ({ children }: Props) => {
  const history = createMemoryHistory();
  return (
    <MockedProvider mocks={mocks}>
      <Provider store={store}>
        <HelmetProvider>
          <Router history={history}>{children}</Router>
        </HelmetProvider>
      </Provider>
    </MockedProvider>
  );
};
