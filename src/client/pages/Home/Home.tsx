import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Main } from '../../components/Main/Main';
import { LastPostsSection } from './LastPostsSection/LastPostsSection';
import { FeaturedSection } from './FeaturedSection/FeaturedSection';

// Exports
export const Home = ({ language }: { language: string }) => (
  <>
    <Helmet>
      <title itemProp="name" lang="en">
        Home
      </title>
    </Helmet>
    <Main>
      <FeaturedSection language={language} />
      <LastPostsSection language={language} />
    </Main>
  </>
);
