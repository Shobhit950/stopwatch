export function formatTime(ms) {
  const minutes = String(Math.floor(ms / 60000)).padStart(2, '0');
  const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  const centiseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, '0');
  return `${minutes}:${seconds}.${centiseconds}`;
}

export function formatTimeParts(ms) {
  return {
    minutes: String(Math.floor(ms / 60000)).padStart(2, '0'),
    seconds: String(Math.floor((ms % 60000) / 1000)).padStart(2, '0'),
    centiseconds: String(Math.floor((ms % 1000) / 10)).padStart(2, '0'),
  };
}

export function getLapStats(laps) {
  if (laps.length === 0) {
    return { fastest: null, slowest: null, average: null };
  }

  const splits = laps.map((lap) => lap.splitMs);
  const fastest = Math.min(...splits);
  const slowest = Math.max(...splits);
  const average = splits.reduce((sum, ms) => sum + ms, 0) / splits.length;

  return { fastest, slowest, average };
}
