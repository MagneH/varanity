import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { App } from './App';

// Mocks
jest.mock('../Navbar/Navbar', () => ({
  Navbar: () => <div key="NavbarMock">NavbarMock</div>,
}));
jest.mock('../../pages/Home/Home', () => ({
  Home: () => <div>HomeMock</div>,
}));
jest.mock('../../pages/Page', () => ({
  Page: () => <div>PageMock</div>,
}));
jest.mock('../../pages/errors/NotFound/NotFound', () => ({
  NotFound: () => <div>NotFoundMock</div>,
}));

describe('Question Screen', () => {
  // Tests
  it('should render Home on /', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    const { getAllByText } = render(
      <HelmetProvider>
        <Router history={history}>
          <App />
        </Router>
      </HelmetProvider>,
    );

    // Assertions
    expect(getAllByText('HomeMock')[0]).toBeInTheDocument();
    expect(getAllByText('HomeMock')[0]).toBeVisible();
  });
  it('should render NotFound on unknown path', () => {
    const history = createMemoryHistory({ initialEntries: ['/non-existent-path'] });
    const { getAllByText } = render(
      <HelmetProvider>
        <Router history={history}>
          <App />
        </Router>
      </HelmetProvider>,
    );

    // Assertions
    expect(getAllByText('NotFoundMock')[0]).toBeInTheDocument();
    expect(getAllByText('NotFoundMock')[0]).toBeVisible();
  });
  it('should support navigation', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    const { getAllByText } = render(
      <HelmetProvider>
        <Router history={history}>
          <App />
        </Router>
      </HelmetProvider>,
    );

    // Click
    history.push('/en/pages/page1');

    // Assertions
    expect(getAllByText('PageMock')[0]).toBeInTheDocument();
    expect(getAllByText('PageMock')[0]).toBeVisible();
  });
});
