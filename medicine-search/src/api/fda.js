const BASE_URL = 'https://api.fda.gov/drug/label.json';
export const RESULT_LIMIT = 20;

export class FdaError extends Error {
  constructor(kind, message, status) {
    super(message);
    this.name = 'FdaError';
    this.kind = kind; 
    this.status = status;
  }
}

export function sanitizeQuery(raw) {
  return raw.replace(/["\\]/g, '').replace(/\s+/g, ' ').trim();
}

async function request(search, limit, signal) {
  const url = `${BASE_URL}?search=${encodeURIComponent(search)}&limit=${limit}`;

  let res;
  try {
    res = await fetch(url, { signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new FdaError('network', "Couldn't reach the FDA database. Check your connection and try again.");
  }

  if (res.status === 404) return [];
  if (res.status === 429) {
    throw new FdaError('rate-limit', 'Too many searches in a short time. Wait a few seconds and try again.', 429);
  }
  if (res.status === 400) {
    throw new FdaError('bad-query', 'That search term contains characters the FDA database can’t handle. Try letters and numbers only.', 400);
  }
  if (!res.ok) {
    throw new FdaError('server', `The FDA database returned an error (${res.status}). Try again in a moment.`, res.status);
  }

  const data = await res.json();
  return Array.isArray(data.results) ? data.results : [];
}

export function fetchByBrand(query, signal) {
  return request(`openfda.brand_name:"${query}"`, RESULT_LIMIT, signal);
}

export async function fetchById(id, signal) {
  if (!/^[A-Za-z0-9-]+$/.test(id)) return null;
  const results = await request(`id:"${id}"`, 1, signal);
  return results[0] ?? null;
}
