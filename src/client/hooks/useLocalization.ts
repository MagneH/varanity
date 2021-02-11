// import { useMemo } from 'react';
// import { SanityDocument } from '@sanity/client';

export const localize = (value: any[] | any, languages: string[]): any => {
  if (Array.isArray(value)) {
    return value.map((v) => localize(v, languages));
  }
  if (typeof value === 'object') {
    if (/^locale[A-Z]/.test(value._type)) {
      const language = languages.find((lang) => value[lang]);
      if (language) {
        return value[language];
      }
    }

    return Object.keys(value).reduce((result, key: string) => {
      const newResult: Record<string, any> = { ...result };
      newResult[key] = localize(value[key], languages);
      return newResult;
    }, {});
  }
  return value;
};

// export const useLocalize = (document: SanityDocument, languages: string[]): SanityDocument => useMemo(() => localize(document, languages), [document, languages]);
