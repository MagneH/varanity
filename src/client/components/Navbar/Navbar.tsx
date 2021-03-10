import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import { Waypoint } from 'react-waypoint';
import { CSSTransition } from 'react-transition-group';
import { SanityDocument } from '@sanity/client';
import { Link } from '../Link/Link';
import { NavHamburger } from './NavHamburger/NavHamburger';
import { NavLink } from './NavLink/NavLink';
import { isApplicationOfflineSelector } from '../../redux/modules/application';

// Styles
import classes from './Navbar.module.scss';
import { LocalizedPageModel } from '../../pages/Page';
import useSelector from '../../redux/typedHooks';
import { Languages, useLocalize } from '../../hooks/useLocalization';
import { LocalizedCategoryModel } from '../../redux/modules/categories';

// Exports
export const Navbar = ({ language }: { language: Languages }) => {
  const pages = useSelector((state) =>
    Object.values(state.documents.data).filter(
      (document: SanityDocument) => document._type === 'page',
    ),
  );
  const localizedPages = useLocalize<LocalizedPageModel[]>(pages, [language]).sort((e1, e2) =>
    e1.title.localeCompare(e2.title),
  );

  const categories = useSelector((state) => Object.values(state.categories.data));
  const localizedCategories = useLocalize<LocalizedCategoryModel[]>(categories, [
    language,
  ]).sort((e1, e2) => e1.title.localeCompare(e2.title));

  const location = useLocation();
  const [isSticky, setIsSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isApplicationOffline = useSelector(isApplicationOfflineSelector);

  const navbarContentId = 'navbar-list';
  const setSticky = () => setIsSticky(true);
  const unsetSticky = () => setIsSticky(false);
  const toggleMenu = () => setIsOpen((prevState) => !prevState);
  const handleInitialPosition = ({ currentPosition, previousPosition }: Waypoint.CallbackArgs) => {
    if (!previousPosition && currentPosition === Waypoint.above) setSticky();
  };

  // Close menu on navigation
  useEffect(() => setIsOpen(false), [location]);
  console.log(location);
  return (
    <>
      <Waypoint
        onEnter={unsetSticky}
        onLeave={setSticky}
        onPositionChange={handleInitialPosition}
      />
      <nav
        className={classNames(classes.navbar, {
          [classes.navbarSticky]: isSticky,
          [classes.navbarOffline]: isApplicationOffline,
        })}
        role="navigation"
      >
        <Link className={classes.navbarLogo} to="/" aria-label="Varanity">
          <h1 className={classes.navbarLogoText}>Varanity</h1>
        </Link>
        <NavHamburger
          isOpen={isOpen}
          onToggle={toggleMenu}
          ariaControls={navbarContentId}
          className={classes.navbarHamburger}
        />
        <CSSTransition
          // Use reverse animation (enter = Menu is hidden and exit = Menu is visible) to hide menu
          // using css - this allows media queries to control whether elements are visible for
          // accessibility reasons (e.g. tabbing and screen readers)
          appear
          in={!isOpen}
          exit={false}
          classNames={{
            enterDone: classes.navbarContentHidden,
          }}
          timeout={200}
        >
          <div
            className={classNames(classes.navbarContent, {
              [classes.navbarContentExpanded]: isOpen,
            })}
          >
            <ul
              id={navbarContentId}
              className={classNames(classes.navbarList, {
                [classes.navbarListContentExpanded]: isOpen,
              })}
            >
              {localizedPages.map((page) => (
                <li
                  key={`page-${page.slug.current}`}
                  className={classNames(classes.navbarListItem)}
                >
                  <NavLink to={`/${language}/pages/${page.slug.current}`}>{page.title}</NavLink>
                </li>
              ))}
              {localizedCategories &&
                localizedCategories
                  .filter((e) => e.slug.current === 'categories')
                  .map((category) => (
                    <li key="categories" className={classNames(classes.navbarListItem)}>
                      <NavLink to={`/${language}/${category.slug.current}`}>
                        {category.title}
                      </NavLink>
                    </li>
                  ))}
              <li key="categories" className={classNames(classes.navbarListItem)}>
                <NavLink
                  to={
                    language === 'en'
                      ? `${location.pathname.replace(language, 'no')}${location.search}`
                      : `${location.pathname.replace(language, 'en')}${location.search}`
                  }
                >
                  {language === 'no' ? 'English' : 'Norsk'}
                </NavLink>
              </li>
            </ul>
          </div>
        </CSSTransition>
      </nav>
    </>
  );
};
