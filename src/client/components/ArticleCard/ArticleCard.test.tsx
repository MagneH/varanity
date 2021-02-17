import React from 'react';
import { render } from '@testing-library/react';
import { Article } from './ArticleCard';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { MockedProvider } from '@apollo/client/testing';
import { Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { createMemoryHistory } from 'history';
import { MockProviderWrapper } from '../../../../test/__mocks__/Wrappers';

// Tests
it('should render title', () => {
  const { getByText } = render(
    <MockProviderWrapper>
      <Article
        article={{
          _id: '',
          _type: 'category',
          slug: { current: 'test', _type: 'string' },
          title: 'Test',
          mainCategory: { _ref: '123', _type: 'category' },
          authors: [],
          isFeatured: true,
          _createdAt: '2021-01-11T17:10:50.339Z',
        }}
        language="en"
      />
    </MockProviderWrapper>,
  );

  // Assertions
  expect(getByText('Test')).toBeInTheDocument();
  expect(getByText('Test')).toBeVisible();
});
