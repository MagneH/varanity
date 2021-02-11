// Exports
export const isUrlExternal = (url: string): boolean =>
  url.startsWith('//') || /^\w+:\/\//i.test(url);
