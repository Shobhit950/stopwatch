import { formatTime } from '../utils/formatTime';

export default function SessionHistory({ sessions, onClear, onNotify }) {
  if (sessions.length === 0) {
    return (
      <section className="session-history session-history--empty" aria-label="Session history">
        <h2>Recent Sessions</h2>
        <p>Completed sessions will appear here after you reset.</p>
      </section>
    );
  }

  return (
    <section className="session-history" aria-label="Session history">
      <div className="session-history__header">
        <h2>Recent Sessions</h2>
        <button
          type="button"
          className="btn btn--ghost btn--compact"
          onClick={() => {
            onClear();
            onNotify('Session history cleared', 'info');
          }}
        >
          Clear
        </button>
      </div>

      <ul className="session-history__list">
        {sessions.map((session) => (
          <li key={session.id} className="session-history__item">
            <div>
              <strong>{formatTime(session.totalMs)}</strong>
              <span>{session.lapCount} laps</span>
            </div>
            <time dateTime={session.savedAt}>
              {new Date(session.savedAt).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </time>
          </li>
        ))}
      </ul>
    </section>
  );
}
