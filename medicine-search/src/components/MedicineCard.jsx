import { Link } from 'react-router-dom';
import { displayName } from '../lib/format';
import Badges from './Badges';

export default function MedicineCard({ medicine: m }) {
  const generic = m.genericNames.join(', ');
  const maker = m.manufacturers[0];
  const extraMakers = m.manufacturers.length - 1;

  return (
    <li>
      <Link className="card" to={`/medicine/${m.id}`} state={{ fromResults: true }}>
        <h2 className="card__brand">{displayName(m)}</h2>
        {generic && <p className="card__generic">{generic}</p>}

        <dl className="card__meta">
          {maker && (
            <div>
              <dt>Made by</dt>
              <dd>
                {maker}
                {extraMakers > 0 && ` +${extraMakers}`}
              </dd>
            </div>
          )}
          {m.drugClasses.length > 0 && (
            <div>
              <dt>Class</dt>
              <dd>{m.drugClasses.join(', ')}</dd>
            </div>
          )}
          {m.productNdcs.length > 0 && (
            <div>
              <dt>NDC</dt>
              <dd className="tabular">{m.productNdcs[0]}</dd>
            </div>
          )}
        </dl>

        <Badges medicine={m} />
      </Link>
    </li>
  );
}
