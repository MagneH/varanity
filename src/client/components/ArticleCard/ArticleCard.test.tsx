import React from 'react';
import { render } from '@testing-library/react';
import { Article } from './ArticleCard';
import { MockProviderWrapper } from '../../../../test/__mocks__/Wrappers';
import { Languages } from '../../hooks/useLocalization';

// Tests
it('should render title', () => {
  const mockObserveFn = () => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
  });

  window.IntersectionObserver = jest.fn().mockImplementation(mockObserveFn);
  const { getByText } = render(
    <MockProviderWrapper>
      <Article
        article={{
          _id: '',
          _type: 'category',
          slug: { current: 'test', _type: 'string' },
          title: 'Test',
          mainCategory: { _ref: '123', _type: 'category', _id: '123' },
          authors: [],
          isFeatured: true,
          _createdAt: '2021-01-11T17:10:50.339Z',
        }}
        language={Languages.en}
      />
    </MockProviderWrapper>,
  );

  // Assertions
  expect(getByText('Test')).toBeInTheDocument();
  expect(getByText('Test')).toBeVisible();
});
