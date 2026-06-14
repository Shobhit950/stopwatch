import { formatTime } from '../utils/formatTime';

export default function LapStats({ laps, stats }) {
  if (laps.length === 0) return null;

  return (
    <div className="lap-stats">
      <div className="lap-stats__item">
        <span className="lap-stats__label">Laps</span>
        <span className="lap-stats__value">{laps.length}</span>
      </div>
      <div className="lap-stats__item">
        <span className="lap-stats__label">Best</span>
        <span className="lap-stats__value lap-stats__value--best">
          {formatTime(stats.fastest)}
        </span>
      </div>
      <div className="lap-stats__item">
        <span className="lap-stats__label">Avg</span>
        <span className="lap-stats__value">{formatTime(stats.average)}</span>
      </div>
      <div className="lap-stats__item">
        <span className="lap-stats__label">Slowest</span>
        <span className="lap-stats__value lap-stats__value--slow">
          {formatTime(stats.slowest)}
        </span>
      </div>
    </div>
  );
}
