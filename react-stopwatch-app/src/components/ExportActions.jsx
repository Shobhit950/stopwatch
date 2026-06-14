import {
  copyToClipboard,
  downloadTextFile,
  lapsToCsv,
  lapsToText,
  shareLaps,
} from '../utils/exportLaps';

export default function ExportActions({ laps, totalMs, onNotify }) {
  const handleCopy = async () => {
    try {
      await copyToClipboard(lapsToText(laps, totalMs));
      onNotify('Lap times copied to clipboard', 'success');
    } catch {
      onNotify('Could not copy lap times', 'error');
    }
  };

  const handleDownload = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    downloadTextFile(`stopwatch-${timestamp}.csv`, lapsToCsv(laps, totalMs), 'text/csv');
    onNotify('CSV downloaded', 'success');
  };

  const handleShare = async () => {
    try {
      await shareLaps(lapsToText(laps, totalMs));
      onNotify('Results shared', 'success');
    } catch (error) {
      if (error?.name !== 'AbortError') {
        onNotify(error.message || 'Sharing failed', 'error');
      }
    }
  };

  const canShare = typeof navigator !== 'undefined' && Boolean(navigator.share);

  return (
    <div className="export-actions">
      <button type="button" className="btn btn--ghost btn--compact" onClick={handleCopy}>
        Copy
      </button>
      <button type="button" className="btn btn--ghost btn--compact" onClick={handleDownload}>
        CSV
      </button>
      {canShare && (
        <button type="button" className="btn btn--ghost btn--compact" onClick={handleShare}>
          Share
        </button>
      )}
    </div>
  );
}
