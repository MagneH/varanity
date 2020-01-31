// @ts-ignore
import BlockContent from '@sanity/block-content-to-react';
import React from 'react';
import { serializers } from '../lib/serializers';
import { PROJECT_ID, DATASET } from '../services/SanityService';

interface Props {
  body: any;
}

const Blocks: React.FC<Props> = ({ body }) => {
  return (
    body && (
      <BlockContent
        blocks={body.filter(({ _type, asset }: { _type: string; asset: any }) =>
          _type !== 'image' ? true : asset,
        )}
        serializers={serializers}
        imageOptions={{ w: 300, h: 300, fit: 'clip' }}
        projectId={PROJECT_ID}
        dataset={DATASET}
      />
    )
  );
};

export { Blocks };
