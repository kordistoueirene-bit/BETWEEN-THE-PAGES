import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './TopBar.css';

export default function TopBar({ title, backTo }) {
  return (
    <header className="top-bar">
      {backTo ? (
        <Link aria-label="Go back" className="top-bar__back" to={backTo}>
          <ArrowLeft aria-hidden="true" size={20} />
        </Link>
      ) : (
        <span aria-hidden="true" className="top-bar__placeholder" />
      )}
      <h2>{title}</h2>
      <span aria-hidden="true" className="top-bar__placeholder" />
    </header>
  );
}