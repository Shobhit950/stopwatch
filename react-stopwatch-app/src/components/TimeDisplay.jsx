import { formatTimeParts } from '../utils/formatTime';

export default function TimeDisplay({ elapsedMs, isRunning }) {
  const { minutes, seconds, centiseconds } = formatTimeParts(elapsedMs);

  return (
    <div className={`time-display ${isRunning ? 'time-display--running' : ''}`} aria-live="polite">
      <span className="time-display__segment">{minutes}</span>
      <span className="time-display__separator">:</span>
      <span className="time-display__segment">{seconds}</span>
      <span className="time-display__separator time-display__separator--small">.</span>
      <span className="time-display__segment time-display__segment--small">{centiseconds}</span>
    </div>
  );
}
