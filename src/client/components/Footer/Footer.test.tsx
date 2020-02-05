import React from 'react';
import { render } from '@testing-library/react';
import { Footer } from './Footer';

// Tests
it('should be made with ❤', () => {
  const { getByText } = render(<Footer language="/en" />);

  // Assertions
  expect(
    getByText((content, element) => element.textContent === 'Made with ❤ by Magne'),
  ).toBeInTheDocument();
  expect(
    getByText((content, element) => element.textContent === 'Made with ❤ by Magne'),
  ).toBeVisible();
});
