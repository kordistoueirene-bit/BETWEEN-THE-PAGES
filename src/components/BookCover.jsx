import './BookCover.css';

export default function BookCover({ book, size = 'md', className = '' }) {
  const classNames = [
    'book-cover',
    `book-cover--${size}`,
    `book-cover--${book.cover.pattern}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      aria-label={`${book.title} by ${book.author}`}
      className={classNames}
      role="img"
      style={{
        '--cover-bg': book.cover.bg,
        '--cover-fg': book.cover.fg,
        '--cover-accent': book.cover.accent,
      }}
    >
      <span aria-hidden="true" className="book-cover__art" />
      <span className="book-cover__title">{book.title}</span>
      <span className="book-cover__author">{book.author}</span>
    </div>
  );
}