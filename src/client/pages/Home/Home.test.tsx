import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Home } from './Home';
import { MockProviderWrapper } from '../../../../test/__mocks__/Wrappers';
import { Languages } from '../../hooks/useLocalization';

// Tests
it('should have correct page title', async (done) => {
  render(
    <MockProviderWrapper>
      <Home language={Languages.en} />
    </MockProviderWrapper>,
  );

  // Assertions
  await waitFor(() => expect(document.title).toEqual('Home'));

  // Done
  done();
});
