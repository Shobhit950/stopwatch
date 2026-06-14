import { formatTime } from '../utils/formatTime';

export default function LapList({ laps, stats }) {
  if (laps.length === 0) {
    return (
      <div className="laps-empty">
        <p>No laps yet</p>
        <span>Press Lap while running to record a split</span>
      </div>
    );
  }

  return (
    <div className="laps-panel">
      <div className="laps-panel__header">
        <h2>Lap Times</h2>
        <span>{laps.length} recorded</span>
      </div>

      <ul className="laps">
        {laps.map((lap) => {
          const isFastest = lap.splitMs === stats.fastest && laps.length > 1;
          const isSlowest = lap.splitMs === stats.slowest && laps.length > 1;

          return (
            <li
              key={lap.id}
              className={[
                'laps__item',
                isFastest && 'laps__item--fastest',
                isSlowest && 'laps__item--slowest',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="laps__number">Lap {lap.number}</span>
              <span className="laps__split">{formatTime(lap.splitMs)}</span>
              <span className="laps__total">{formatTime(lap.totalMs)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
