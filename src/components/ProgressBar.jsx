import './ProgressBar.css';

export default function ProgressBar({ value = 0, label = 'Progress' }) {
  const progress = Math.min(100, Math.max(0, value));

  return (
    <div
      aria-label={label}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={progress}
      className="ui-progress"
      role="progressbar"
    >
      <span className="ui-progress__value" style={{ width: `${progress}%` }} />
    </div>
  );
}