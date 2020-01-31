import React from 'react';

const serializers = {
  types: {
    code: ({ node: { language, code } }: any) => (
      <pre data-language={language}>
        <code>{code}</code>
      </pre>
    ),
  },
};

export { serializers };
