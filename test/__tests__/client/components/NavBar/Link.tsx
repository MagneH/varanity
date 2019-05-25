import * as React from 'react';
import { NavBarLink } from '../../../../../src/client/components/NavBar/Link';
import { shallow } from 'enzyme';

// Tests
test('should render correctly for internal links', () => {
  const component = shallow(<NavBarLink to="/">LinkText</NavBarLink>);
  expect(component.hasClass('navbar__link')).toBe(true);
  expect(component.prop('rel')).toBe(undefined);
  expect(component.prop('href')).toBe(undefined);
});
test('should render correctly for external non-secure links', () => {
  const component = shallow(<NavBarLink to="http://varan-boilerplate.herokuapp.com">LinkText</NavBarLink>);
  expect(component.hasClass('navbar__link')).toBe(true);
  expect(component.hasClass('navbar__link--external')).toBe(true);
  expect(component.prop('rel')).toBe('noopener');
  expect(component.prop('href')).toBe('http://varan-boilerplate.herokuapp.com');
});
test('should render correctly for external secure links', () => {
  const component = shallow(<NavBarLink to="https://varan-boilerplate.herokuapp.com">LinkText</NavBarLink>);
  expect(component.hasClass('navbar__link')).toBe(true);
  expect(component.hasClass('navbar__link--external')).toBe(true);
  expect(component.prop('rel')).toBe('noopener');
  expect(component.prop('href')).toBe('https://varan-boilerplate.herokuapp.com');
});