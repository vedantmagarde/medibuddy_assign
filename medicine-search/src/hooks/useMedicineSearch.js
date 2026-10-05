import { useCallback, useEffect, useState } from 'react';
import { fetchByBrand, sanitizeQuery } from '../api/fda';
import { getSearch, setSearch } from '../api/cache';
import { toMedicine } from '../lib/normalize';

export const MIN_QUERY_LENGTH = 2;

const IDLE = { status: 'idle', results: [], error: null, query: '' };

function fromCache(query) {
  const items = getSearch(query);
  return items ? { status: items.length ? 'success' : 'empty', results: items, error: null, query } : null;
}

export function useMedicineSearch(rawQuery) {
  const query = sanitizeQuery(rawQuery);

  const [state, setState] = useState(() =>
    query.length < MIN_QUERY_LENGTH ? IDLE : fromCache(query) ?? { ...IDLE, status: 'loading', query },
  );
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (query.length < MIN_QUERY_LENGTH) {
      setState(IDLE);
      return;
    }

    const cached = fromCache(query);
    if (cached) {
      setState((prev) => (prev.results === cached.results && prev.query === query ? prev : cached));
      return;
    }


    const controller = new AbortController();
    setState((prev) => ({ status: 'loading', results: prev.results, error: null, query }));

    fetchByBrand(query, controller.signal)
      .then((raw) => {
        if (controller.signal.aborted) return;
        const items = raw.map(toMedicine);
        setSearch(query, items);
        setState({ status: items.length ? 'success' : 'empty', results: items, error: null, query });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setState({ status: 'error', results: [], error, query });
      });

    return () => controller.abort();
  }, [query, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, retry };
}
