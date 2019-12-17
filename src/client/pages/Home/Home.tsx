import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Main } from '../../components/Main/Main';
import { FeaturesSection } from './FeaturesSection/FeaturesSection';
import { GetStartedSection } from './GetStartedSection/GetStartedSection';
import { TerminalHeader } from './TerminalHeader/TerminalHeader';

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
      <FeaturesSection />
      <GetStartedSection />
    </Main>
  </>
);
