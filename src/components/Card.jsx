import './Card.css';

export default function Card({ children, className = '', ...props }) {
  return (
    <section className={['ui-card', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </section>
  );
}