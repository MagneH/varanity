import React from 'react';
import { SanityBlock } from '@sanity/client';
import { Accordeon } from '../components/Accordeon';
import { Blocks } from '../components/Blocks';

interface AccordeonSerializerProps {
  node: { title: string; text: SanityBlock[]; isInitiallyOpen: boolean };
}

const AccordionSerializer = ({
  node: { title, text, isInitiallyOpen },
}: AccordeonSerializerProps) => (
  <Accordeon label={title} isInitiallyOpen={isInitiallyOpen}>
    <Blocks body={text} />
  </Accordeon>
);

const serializers = {
  types: {
    code: ({ node: { language, code } }: any) => (
      <pre data-language={language}>
        <code>{code}</code>
      </pre>
    ),
    accordeon: AccordionSerializer,
  },
};

export { serializers };
