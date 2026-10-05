import { memo } from 'react';
import MedicineCard from './MedicineCard';

function ResultsList({ results, stale }) {
  return (
    <ul className={`results${stale ? ' results--stale' : ''}`} aria-busy={stale}>
      {results.map((m) => (
        <MedicineCard key={m.id} medicine={m} />
      ))}
    </ul>
  );
}

export default memo(ResultsList);
