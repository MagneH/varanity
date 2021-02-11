import React from 'react';
import { render } from '@testing-library/react';
import { Article } from './ArticleCard';

// Tests
it('should render title', () => {
  const { getByText } = render(
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
    />,
  );

  // Assertions
  expect(getByText('Test')).toBeInTheDocument();
  expect(getByText('Test')).toBeVisible();
});
