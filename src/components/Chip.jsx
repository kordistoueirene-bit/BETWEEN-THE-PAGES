import './Chip.css';

export default function Chip({ children, selected = false, onClick, className = '', ...props }) {
  const classNames = ['ui-chip', selected && 'ui-chip--selected', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      aria-pressed={selected}
      className={classNames}
      onClick={onClick}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}