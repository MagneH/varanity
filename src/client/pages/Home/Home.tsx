import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Main } from '../../components/Main/Main';
import { LastPostsSection } from './LastPostsSection/LastPostsSection';
import { TerminalHeader } from './TerminalHeader/TerminalHeader';
import { FeaturedSection } from './FeaturedSection/FeaturedSection';

// Exports
export const Home = ({ language, location }: { language: string; location: Location }) => (
  <>
    <Helmet>
      <title itemProp="name" lang="en">
        Home
      </title>
    </Helmet>
    <TerminalHeader title="varan" subtitle="modern webdev made simple" animation="install" />
    <Main>
      <LastPostsSection />
      <FeaturedSection />
    </Main>
  </>
);
