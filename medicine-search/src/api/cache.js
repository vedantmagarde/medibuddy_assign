const TTL_MS = 10 * 60 * 1000;
const MAX_SEARCHES = 50;
const MAX_MEDICINES = 500;

const searches = new Map();
const medicines = new Map();

const keyFor = (query) => query.toLowerCase();

function touch(map, key, value, max) {
  map.delete(key);
  map.set(key, value);
  if (map.size > max) map.delete(map.keys().next().value);
}

export function getSearch(query) {
  const key = keyFor(query);
  const entry = searches.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.at > TTL_MS) {
    searches.delete(key);
    return undefined;
  }
  touch(searches, key, entry, MAX_SEARCHES);
  return entry.items;
}

export function setSearch(query, items) {
  touch(searches, keyFor(query), { at: Date.now(), items }, MAX_SEARCHES);
  items.forEach((m) => touch(medicines, m.id, m, MAX_MEDICINES));
}

export const getMedicine = (id) => medicines.get(id);
export const setMedicine = (m) => touch(medicines, m.id, m, MAX_MEDICINES);
