import { useCallback, useState } from 'react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useSettings } from '../hooks/useSettings';
import { useStopwatch } from '../hooks/useStopwatch';
import { useToast } from '../hooks/useToast';
import { useWakeLock } from '../hooks/useWakeLock';
import {
  clearSessionHistory,
  loadSessionHistory,
  saveSessionToHistory,
} from '../utils/sessions';
import ConfirmDialog from './ConfirmDialog';
import ExportActions from './ExportActions';
import LapList from './LapList';
import LapStats from './LapStats';
import SessionHistory from './SessionHistory';
import SettingsPanel from './SettingsPanel';
import StopwatchControls from './StopwatchControls';
import TimeDisplay from './TimeDisplay';
import Toast from './Toast';

export default function Stopwatch() {
  const { settings, updateSetting } = useSettings();
  const { toast, showToast, hideToast } = useToast();
  const [sessionHistory, setSessionHistory] = useState(() => loadSessionHistory());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const {
    isRunning,
    elapsed,
    laps,
    stats,
    start,
    pause,
    reset,
    clearLaps,
    lap,
    toggle,
  } = useStopwatch({ persistSession: settings.persistSession });

  useWakeLock(settings.keepScreenAwake, isRunning);

  const hasProgress = elapsed > 0 || laps.length > 0;

  const performReset = useCallback(() => {
    if (hasProgress) {
      setSessionHistory(saveSessionToHistory({ elapsed, laps }));
    }
    reset();
    setShowResetConfirm(false);
    showToast('Stopwatch reset', 'info');
  }, [elapsed, hasProgress, laps, reset, showToast]);

  const requestReset = useCallback(() => {
    if (settings.confirmReset && hasProgress) {
      setShowResetConfirm(true);
      return;
    }
    performReset();
  }, [hasProgress, performReset, settings.confirmReset]);

  useKeyboardShortcuts({
    onToggle: toggle,
    onLap: lap,
    onReset: requestReset,
  });

  return (
    <div className="app">
      <Toast toast={toast} onDismiss={hideToast} />

      <ConfirmDialog
        open={showResetConfirm}
        title="Reset stopwatch?"
        message="Your current time and laps will be saved to session history before resetting."
        confirmLabel="Reset"
        onConfirm={performReset}
        onCancel={() => setShowResetConfirm(false)}
      />

      <main className="stopwatch-card">
        <header className="stopwatch-card__header">
          <div>
            <p className="stopwatch-card__eyebrow">Precision Timer</p>
            <h1>Stopwatch</h1>
          </div>
          <span
            className={`status-badge ${isRunning ? 'status-badge--running' : 'status-badge--paused'}`}
          >
            {isRunning ? 'Running' : elapsed > 0 ? 'Paused' : 'Ready'}
          </span>
        </header>

        <TimeDisplay elapsedMs={elapsed} isRunning={isRunning} />

        <StopwatchControls
          isRunning={isRunning}
          hasLaps={laps.length > 0}
          onStart={start}
          onPause={pause}
          onReset={requestReset}
          onLap={lap}
          onClearLaps={() => {
            clearLaps();
            showToast('Laps cleared', 'info');
          }}
        />

        {laps.length > 0 && (
          <ExportActions laps={laps} totalMs={elapsed} onNotify={showToast} />
        )}

        <LapStats laps={laps} stats={stats} />
        <LapList laps={laps} stats={stats} />

        <SettingsPanel settings={settings} onChange={updateSetting} />
        <SessionHistory
          sessions={sessionHistory}
          onClear={() => setSessionHistory(clearSessionHistory())}
          onNotify={showToast}
        />
      </main>
    </div>
  );
}
