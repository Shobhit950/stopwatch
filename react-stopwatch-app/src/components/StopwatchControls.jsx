export default function StopwatchControls({
  isRunning,
  hasLaps,
  onStart,
  onPause,
  onReset,
  onLap,
  onClearLaps,
}) {
  return (
    <div className="controls">
      <div className="controls__primary">
        {!isRunning ? (
          <button
            type="button"
            className="btn btn--primary"
            onClick={onStart}
            aria-label="Start stopwatch"
          >
            Start
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--warning"
            onClick={onPause}
            aria-label="Pause stopwatch"
          >
            Pause
          </button>
        )}
        <button
          type="button"
          className="btn btn--secondary"
          onClick={onLap}
          disabled={!isRunning}
          aria-label="Record lap"
        >
          Lap
        </button>
      </div>

      <div className="controls__secondary">
        <button type="button" className="btn btn--ghost" onClick={onReset} aria-label="Reset stopwatch">
          Reset
        </button>
        {hasLaps && (
          <button type="button" className="btn btn--ghost" onClick={onClearLaps} aria-label="Clear laps">
            Clear Laps
          </button>
        )}
      </div>

      <p className="controls__hint">Space start/pause · L lap · R reset</p>
    </div>
  );
}
