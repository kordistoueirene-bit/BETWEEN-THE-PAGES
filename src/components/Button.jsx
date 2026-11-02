import { Link } from 'react-router-dom';
import './Button.css';

export default function Button({
  children,
  variant = 'primary',
  to,
  type = 'button',
  className = '',
  ...props
}) {
  const classNames = ['ui-button', `ui-button--${variant}`, className].filter(Boolean).join(' ');

  if (to) {
    return (
      <Link className={classNames} to={to} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classNames} type={type} {...props}>
      {children}
    </button>
  );
}