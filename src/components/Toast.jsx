export default function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  return (
    <div className={`toast toast--${toast.type}`} role="status" aria-live="polite">
      <span>{toast.message}</span>
      <button type="button" className="toast__close" aria-label="Dismiss notification" onClick={onDismiss}>
        ×
      </button>
    </div>
  );
}
