import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import { Waypoint } from 'react-waypoint';
import { useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import {SanityDocument} from "@sanity/client";
import { Link } from '../Link/Link';
import { NavHamburger } from './NavHamburger/NavHamburger';
import { NavLink } from './NavLink/NavLink';
import { isApplicationOfflineSelector } from '../../redux/modules/application';
import { RootState } from '../../redux';

// Styles
import classes from './Navbar.module.scss';
import url from "url";
import {ArticleModel} from "../../pages/Article";
import {PageModel} from "../../pages/Page";

// Exports
export const Navbar = ({ language }: { language: string }) => {
  const pages = useSelector<RootState, PageModel[]>(state => {
    console.log(Object.values(state.documents.data));
    return Object.values(state.documents.data).filter((document: SanityDocument) => document._type === 'page');
  });
  console.log(pages);
  const location = useLocation();
  const [isSticky, setIsSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isApplicationOffline = useSelector<RootState, boolean>(isApplicationOfflineSelector);

  const navbarContentId = 'navbar-list';
  const setSticky = () => setIsSticky(true);
  const unsetSticky = () => setIsSticky(false);
  const toggleMenu = () => setIsOpen(prevState => !prevState);
  const handleInitialPosition = ({ currentPosition, previousPosition }: Waypoint.CallbackArgs) => {
    if (!previousPosition && currentPosition === Waypoint.above) setSticky();
  };

  // Close menu on navigation
  useEffect(() => setIsOpen(false), [location]);

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
        <Link className={classes.navbarLogo} to="/" aria-label="Home">
          <h1 className={classes.navbarLogoText}>Varan</h1>
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
              {pages.map((page: PageModel) => {
                return(
                  <li className={classNames(classes.navbarListItem)} key={page._id}>
                    <NavLink to={`/${language}/pages/${page.slug.current}`}>{page.title}</NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        </CSSTransition>
      </nav>
    </>
  );
};
