import React, { ReactNode } from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Waypoint } from 'react-waypoint';
import * as redux from 'react-redux';
import { Navbar } from './Navbar';
import { MockProviderWrapper } from '../../../../test/__mocks__/Wrappers';
import { Languages } from '../../hooks/useLocalization';

// Mocks
const WaypointMock = (Waypoint as any) as jest.Mock<ReactNode>;
jest.mock('react-waypoint', () => ({
  Waypoint: jest.fn(() => 'mocked-waypoint'),
}));
jest.mock('./Navbar.module.scss', () => ({
  navbarSticky: 'mocked-sticky-menu',
  navbarOffline: 'mocked-offline-menu',
  navbarContentExpanded: 'mocked-expanded-hamburger-menu',
}));
const isOfflineMock = jest.spyOn(redux, 'useSelector').mockReturnValue(false);

// Tests
beforeEach(() => {
  jest.clearAllMocks();
  Waypoint.above = 'above';
  Waypoint.below = 'below';
});
it('should be nav', () => {
  const { container } = render(
    <MockProviderWrapper>
      <Navbar language={Languages.en} />
    </MockProviderWrapper>,
  );

  // Assertions
  expect(container.querySelector('nav')).toBeInTheDocument();
  expect(container.querySelector('nav')).toBeVisible();
});
describe('stickyness', () => {
  it('should not be sticky by default', () => {
    const { container } = render(
      <MockProviderWrapper>
        <Navbar language={Languages.en} />
      </MockProviderWrapper>,
      { wrapper: MemoryRouter },
    );

    // Assertions
    expect(container.querySelector('.mocked-sticky-menu')).not.toBeInTheDocument();
  });
  it('should not be sticky if navbar is fully visible in viewport', () => {
    WaypointMock.mockImplementation(({ onPositionChange }) => {
      onPositionChange({ currentPosition: Waypoint.below });
      return 'mocked-waypoint';
    });
    const { container } = render(
      <MockProviderWrapper>
        <Navbar language={Languages.en} />
      </MockProviderWrapper>,
    );

    // Assertions
    expect(container.querySelector('.mocked-sticky-menu')).not.toBeInTheDocument();
  });
  it('should be sticky if navbar is not fully visible in viewport', () => {
    WaypointMock.mockImplementation(({ onPositionChange }) => {
      onPositionChange({ currentPosition: Waypoint.above });
      return 'mocked-waypoint';
    });
    const { container } = render(
      <MockProviderWrapper>
        <Navbar language={Languages.en} />
      </MockProviderWrapper>,
    );

    // Assertions
    expect(container.querySelector('.mocked-sticky-menu')).toBeInTheDocument();
  });
  it('should become sticky if navbar is no longer fully visible in viewport', () => {
    let onLeaveRef: () => void;
    WaypointMock.mockImplementation(({ onLeave }) => {
      onLeaveRef = onLeave;
      return 'mocked-waypoint';
    });

    const { container } = render(
      <MockProviderWrapper>
        <Navbar language={Languages.en} />
      </MockProviderWrapper>,
    );

    // Mock scrolling
    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      onLeaveRef!();
    });

    // Assertions
    expect(container.querySelector('.mocked-sticky-menu')).toBeInTheDocument();
  });
  it('should become unsticky if navbar becomes fully visible in viewport', () => {
    let onEnterRef: () => void;
    WaypointMock.mockImplementation(({ onEnter, onPositionChange }) => {
      onEnterRef = onEnter;
      onPositionChange({ currentPosition: Waypoint.above, previousPosition: Waypoint.below });
      return 'mocked-waypoint';
    });

    const { container } = render(
      <MockProviderWrapper>
        <Navbar language={Languages.en} />
      </MockProviderWrapper>,
    );

    // Mock scrolling
    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      onEnterRef!();
    });

    // Assertions
    expect(container.querySelector('.mocked-sticky-menu')).not.toBeInTheDocument();
  });
});
describe('offline status', () => {
  it('should be on when application is offline', () => {
    isOfflineMock.mockReturnValue(true);
    const { container } = render(
      <MockProviderWrapper>
        <Navbar language={Languages.en} />
      </MockProviderWrapper>,
    );

    // Assertions
    expect(container.querySelector('.mocked-offline-menu')).toBeInTheDocument();
    expect(container.querySelector('.mocked-offline-menu')).toBeVisible();
  });
});
describe('hamburger', () => {
  it('should have menu hamburger button', () => {
    const { getByLabelText } = render(
      <MockProviderWrapper>
        <Navbar language={Languages.en} />
      </MockProviderWrapper>,
    );

    // Assertions
    expect(getByLabelText('Menu')).toBeInTheDocument();
  });
  it('should not be open by default', () => {
    const { container } = render(
      <MockProviderWrapper>
        <Navbar language={Languages.en} />
      </MockProviderWrapper>,
    );

    // Assertions
    expect(container.querySelector('.mocked-expanded-hamburger-menu')).not.toBeInTheDocument();
  });
  it('should open when Menu button is clicked', () => {
    const { container, getByLabelText } = render(
      <MockProviderWrapper>
        <Navbar language={Languages.en} />
      </MockProviderWrapper>,
    );

    // Click
    fireEvent.click(getByLabelText('Menu'));

    // Assertions
    expect(container.querySelector('.mocked-expanded-hamburger-menu')).toBeInTheDocument();
    expect(container.querySelector('.mocked-expanded-hamburger-menu')).toBeVisible();
  });
  it('should close when Menu button is clicked twice', () => {
    const { container, getByLabelText } = render(
      <MockProviderWrapper>
        <Navbar language={Languages.en} />
      </MockProviderWrapper>,
    );

    // Click
    fireEvent.click(getByLabelText('Menu'));
    fireEvent.click(getByLabelText('Menu'));

    // Assertions
    expect(container.querySelector('.mocked-expanded-hamburger-menu')).not.toBeInTheDocument();
  });
});
