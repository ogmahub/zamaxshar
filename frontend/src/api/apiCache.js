const cache = new Map();
const TTL = 5 * 60 * 1000;

export const getCached = (url) => {
  const e = cache.get(url);
  if (!e) return null;
  if (Date.now() - e.t > TTL) { cache.delete(url); return null; }
  return e.data;
};

export const setCached = (url, data) => cache.set(url, { data, t: Date.now() });

export const invalidateCache = (url) => {
  if (url) cache.delete(url);
  else cache.clear();
};
