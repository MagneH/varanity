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
      }}
      language="en"
    />,
  );

  // Assertions
  expect(getByText('Test')).toBeInTheDocument();
  expect(getByText('Test')).toBeVisible();
});
