import { useMemo } from 'react';
import { SanityDocument } from '@sanity/client';
import { SanityDocumentWithDataModel } from '../../../types/SanityDocumentWithDataModel';
import { ensure } from '../lib/ensure';

const replacerCurry = (data: Record<string, string>) => (intpl = '') => {
  const key = ensure(intpl.match(/[A-z]+/gm))[0];
  // eslint-disable-next-line no-console
  if (!(key in data)) console.warn(`Key ${key} from ${intpl} not found in details Object`);
  return data[key] || intpl;
};

const interpolator = (string: string, data: Record<string, string>) => {
  const matches = string.match(/\${([A-z]*)}/gm) || [];
  return matches.reduce((prev, curr) => {
    return prev.replace(curr, replacerCurry(data));
  }, string);
};

export const interpolate = (value: any, data: Record<string, string>): any => {
  if (Array.isArray(value)) {
    return value.map(v => interpolate(v, data));
  }
  if (typeof value === 'object') {
    if (/(string|span)/.test(value._type)) {
      return { ...value, text: interpolator(value.text, data) };
    }
    if (/(link)/.test(value._type)) {
      return { ...value, href: interpolator(value.href, data) };
    }
    return Object.keys(value).reduce((result: Record<string, string>, key: string) => {
      const newResult = { ...result };
      newResult[key] = interpolate(value[key], data);
      return newResult;
    }, {});
  }
  if (typeof value === 'string') {
    return interpolator(value, data);
  }
  return value;
};

export const useDataInterpolation = (
  document: SanityDocument,
  data: any,
): SanityDocumentWithDataModel => {
  return useMemo(() => interpolate(document, data), [document, data]);
};
