import { useMemo } from 'react';
import { SanityDocument } from '@sanity/client';

const replacerCurry = (data: Record<string, string>) => (intpl = '') => {
  const search = intpl.match(/[A-z]+/gm);
  if (Array.isArray(search)) {
    const key = search[0];
    if (!(key in data)) console.warn(`Key ${key} from ${intpl} not found in details Object`);
    if (key === '') console.warn(`Key is empty`);
    return data[key] || intpl;
  }
  // eslint-disable-next-line no-console

  return intpl;
};

const interpolator = (string: string, data: Record<string, string>) => {
  const matches = string.match(/\${([A-z]*)}/gm) || [];
  return matches.reduce((prev, curr) => prev.replace(curr, replacerCurry(data)), string);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const interpolate = (value: any, data: Record<string, string>): any => {
  if (Array.isArray(value)) {
    return value.map((v) => interpolate(v, data));
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

export const useDataInterpolation = <T>(
  document: SanityDocument,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  data: any,
): T => useMemo(() => interpolate(document, data), [document, data]);
