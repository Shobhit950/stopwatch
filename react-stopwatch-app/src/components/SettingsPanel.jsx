export default function SettingsPanel({ settings, onChange }) {
  return (
    <section className="settings-panel" aria-label="Stopwatch settings">
      <h2>Settings</h2>
      <label className="settings-panel__option">
        <input
          type="checkbox"
          checked={settings.confirmReset}
          onChange={(event) => onChange('confirmReset', event.target.checked)}
        />
        <span>Confirm before reset</span>
      </label>
      <label className="settings-panel__option">
        <input
          type="checkbox"
          checked={settings.persistSession}
          onChange={(event) => onChange('persistSession', event.target.checked)}
        />
        <span>Auto-save session</span>
      </label>
      <label className="settings-panel__option">
        <input
          type="checkbox"
          checked={settings.keepScreenAwake}
          onChange={(event) => onChange('keepScreenAwake', event.target.checked)}
        />
        <span>Keep screen awake while running</span>
      </label>
    </section>
  );
}
