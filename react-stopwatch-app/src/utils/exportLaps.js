import { formatTime } from './formatTime';

export function lapsToCsv(laps, totalMs) {
  const header = 'Lap,Split,Total';
  const rows = [...laps]
    .reverse()
    .map((lap) => `${lap.number},${formatTime(lap.splitMs)},${formatTime(lap.totalMs)}`);
  const summary = `Summary,,${formatTime(totalMs)}`;
  return [header, ...rows, summary].join('\n');
}

export function lapsToText(laps, totalMs) {
  const lines = [...laps]
    .reverse()
    .map((lap) => `Lap ${lap.number}: ${formatTime(lap.splitMs)} (total ${formatTime(lap.totalMs)})`);

  lines.push(`Final time: ${formatTime(totalMs)}`);
  return lines.join('\n');
}

export async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

export function downloadTextFile(filename, content, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function shareLaps(text) {
  if (!navigator.share) {
    throw new Error('Sharing is not supported on this device.');
  }

  await navigator.share({
    title: 'Stopwatch Results',
    text,
  });
}
