import React from 'react';
import { render } from '@testing-library/react';
import { Footer } from './Footer';

// Tests
it('should be made with ❤', () => {
  const { getByText } = render(<Footer />);

  // Assertions
  expect(
    getByText((content, element) => !!element && element.textContent === 'Made with ❤ by Magne'),
  ).toBeInTheDocument();
  expect(
    getByText((content, element) => !!element && element.textContent === 'Made with ❤ by Magne'),
  ).toBeVisible();
});
