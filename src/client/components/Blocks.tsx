import BlockContent from '@sanity/block-content-to-react';
import React from 'react';
import { SanityBlock } from '@sanity/client';
import { serializers } from '../lib/serializers';
import { PROJECT_ID, DATASET } from '../services/SanityService';

interface Props {
  body: SanityBlock[];
}

const Blocks = ({ body }: Props) =>
  body && (
    <BlockContent
      blocks={body}
      serializers={serializers}
      imageOptions={{ w: 300, h: 300, fit: 'clip' }}
      projectId={PROJECT_ID}
      dataset={DATASET}
    />
  );

export { Blocks };
