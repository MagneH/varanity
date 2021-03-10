import { SanityDocument } from '@sanity/client';
import { useMemo } from 'react';

export const localize = (value: any | any[], languages: Languages[]): any => {
  if (Array.isArray(value)) {
    return value.map((v) => localize(v, languages));
  }
  if (typeof value === 'object') {
    if (/localeString/.test(value._type)) {
      const language = languages.find((lang) => value[lang]);
      console.log(language);
      if (language) {
        return value[language];
      }
      return '';
    }

    if (/localeBlock/.test(value._type)) {
      const language = languages.find((lang) => value[lang]);
      if (language) {
        return value[language];
      }
      return {
        _type: 'block',
      };
    }

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

export const useLocalize = <T>(
  value: SanityDocument | SanityDocument[] | undefined,
  languages: Languages[],
): T =>
  useMemo(() => {
    if (Array.isArray(value)) {
      return value.map((e) => localize(e, languages));
    }
    return localize(value, languages);
  }, [value, languages]);

export enum Languages {
  no = 'no',
  en = 'en',
}
