import React from 'react';
import { render } from '@testing-library/react';
import { Category } from './CategoryCard';

// Tests
it('should render title', () => {
  const { getByText } = render(
    <Category
      category={{
        _id: '',
        _type: 'category',
        slug: { current: 'test', _type: 'string' },
        title: 'Test',
        parent: { _ref: '123' },
      }}
      language="en"
    />,
  );

  // Assertions
  expect(getByText('Test')).toBeInTheDocument();
  expect(getByText('Test')).toBeVisible();
});
