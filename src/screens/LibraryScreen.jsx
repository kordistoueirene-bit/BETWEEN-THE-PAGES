import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, ChevronDown, Heart, Minus, MoreHorizontal, Plus, Star } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import BookCover from '../components/BookCover.jsx';
import { BOOKS } from '../data/index.js';
import { useAppContext } from '../context/AppContext.jsx';
import './LibraryScreen.css';

const TABS = ['Want to read', 'Reading', 'Read', 'Favorites ♥'];
const TAB_KEYS = {
  'Want to read': 'saved',
  Reading: 'reading',
  Read: 'read',
  'Favorites ♥': 'favorites',
};
const LIST_KEYS = ['saved', 'reading', 'read', 'favorites'];

function getBookById(id) {
  return BOOKS.find((book) => book.id === id) || null;
}

function getBooksForList(ids = []) {
  return ids
    .map(getBookById)
    .filter(Boolean);
}

export default function LibraryScreen() {
  const location = useLocation();
  const { userProfile, library, toggleInList, rateBook } = useAppContext();
  const [activeTab, setActiveTab] = useState('Want to read');
  const [menuId, setMenuId] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const showBackToProfile = location.state?.origin === 'profile';

  const activeKey = TAB_KEYS[activeTab];
  const books = getBooksForList(library[activeKey] || []);

  const readCount = Math.max(library.read.length, 12);
  const favoriteGenre = userProfile?.favoriteGenres?.[0] || 'Fantasy';
  const totalPages = library.read.reduce((sum, id) => {
    const found = getBookById(id);
    return sum + (found?.pages || 0);
  }, 0) || 3450;

  const statsText = `${readCount} books read this year · Favorite genre: ${favoriteGenre} · ${totalPages.toLocaleString()} pages`;

  const moveBook = (bookId, targetKey) => {
    const currentKey = Object.keys(TAB_KEYS).find((key) => (library[TAB_KEYS[key]] || []).includes(bookId));
    const currentListKey = currentKey ? TAB_KEYS[currentKey] : null;

    LIST_KEYS.forEach((key) => {
      if ((library[key] || []).includes(bookId)) {
        toggleInList(key, bookId);
      }
    });

    if (targetKey && !((library[targetKey] || []).includes(bookId))) {
      toggleInList(targetKey, bookId);
    }

    if (currentListKey && targetKey && currentListKey !== targetKey) {
      setMenuId(null);
    }
    setMenuId(null);
  };

  const removeBook = (bookId) => {
    LIST_KEYS.forEach((key) => {
      if ((library[key] || []).includes(bookId)) {
        toggleInList(key, bookId);
      }
    });
    setMenuId(null);
  };

  const adjustProgress = (bookId, delta) => {
    setProgressMap((current) => {
      const nextValue = Math.min(100, Math.max(0, (current[bookId] ?? 60) + delta));
      return { ...current, [bookId]: nextValue };
    });
  };

  const renderEmpty = () => (
    <div className="library-empty-state">
      <div aria-hidden="true" className="library-empty-state__art">📚</div>
      <h3>No books here yet</h3>
      <p>Save the books you love and build your next great reading list.</p>
      <Link className="library-empty-state__button" to="/mood">Find my next book</Link>
    </div>
  );

  const renderItemActions = (book) => (
    <div className="library-item__menu-wrap">
      <button className="library-item__menu-button" onClick={() => setMenuId((current) => current === book.id ? null : book.id)} type="button" aria-label={`More actions for ${book.title}`}>
        <MoreHorizontal size={18} />
      </button>
      {menuId === book.id && (
        <div className="library-item__menu">
          {Object.entries(TAB_KEYS).map(([label, key]) => (
            <button key={label} onClick={() => moveBook(book.id, key)} type="button">
              Move to {label}
            </button>
          ))}
          <button onClick={() => removeBook(book.id)} type="button">Remove</button>
        </div>
      )}
    </div>
  );

  const renderReadingItem = (book) => {
    const progress = progressMap[book.id] ?? 60;
    return (
      <div className="library-item" key={book.id}>
        <Link className="library-item__main" to={`/book/${book.id}`}>
          <BookCover book={book} size="sm" />
          <div className="library-item__details">
            <strong>{book.title}</strong>
            <span>{book.author}</span>
            <small>{book.pages} pages · {book.pace}</small>
          </div>
        </Link>

        <div className="library-item__controls">
          <div className="library-progress">
            <div className="library-progress__bar" style={{ width: `${progress}%` }} />
          </div>
          <div className="library-progress__actions">
            <button onClick={() => adjustProgress(book.id, -10)} type="button" aria-label={`Decrease progress for ${book.title}`}><Minus size={14} /></button>
            <span>{progress}%</span>
            <button onClick={() => adjustProgress(book.id, 10)} type="button" aria-label={`Increase progress for ${book.title}`}><Plus size={14} /></button>
          </div>
        </div>

        {renderItemActions(book)}
      </div>
    );
  };

  const renderReadItem = (book) => {
    const stars = Number(library.ratings?.[book.id] ?? 4);
    return (
      <div className="library-item" key={book.id}>
        <Link className="library-item__main" to={`/book/${book.id}`}>
          <BookCover book={book} size="sm" />
          <div className="library-item__details">
            <strong>{book.title}</strong>
            <span>{book.author}</span>
            <small>{book.pages} pages · {book.ending}</small>
          </div>
        </Link>

        <div className="library-item__rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              aria-label={`Rate ${book.title} ${value} stars`}
              className={value <= stars ? 'is-filled' : ''}
              key={value}
              onClick={() => rateBook(book.id, value)}
              type="button"
            >
              <Star fill={value <= stars ? 'currentColor' : 'none'} size={14} />
            </button>
          ))}
        </div>

        {renderItemActions(book)}
      </div>
    );
  };

  const renderStandardItem = (book) => (
    <div className="library-item" key={book.id}>
      <Link className="library-item__main" to={`/book/${book.id}`}>
        <BookCover book={book} size="sm" />
        <div className="library-item__details">
          <strong>{book.title}</strong>
          <span>{book.author}</span>
          <small>{book.pages} pages · {book.genre || 'Fiction'}</small>
        </div>
      </Link>
      {renderItemActions(book)}
    </div>
  );

  const renderList = () => {
    if (!books.length) return renderEmpty();

    return books.map((book) => {
      if (activeTab === 'Reading') return renderReadingItem(book);
      if (activeTab === 'Read') return renderReadItem(book);
      return renderStandardItem(book);
    });
  };

  return (
    <main className="library-screen">
      <header className="library-header">
        {showBackToProfile ? (
          <Link aria-label="Back to profile" className="library-header__back" to="/profile">
            <ArrowLeft aria-hidden="true" size={20} />
          </Link>
        ) : (
          <span aria-hidden="true" className="library-header__placeholder" />
        )}
        <h1>My Library</h1>
        <span aria-hidden="true" className="library-header__placeholder" />
      </header>

      <div className="library-stats">
        <span>{statsText}</span>
      </div>

      <div className="library-tabs" role="tablist" aria-label="Library tabs">
        {TABS.map((tab) => (
          <button
            aria-selected={activeTab === tab}
            className={`library-tab ${activeTab === tab ? 'is-active' : ''}`}
            key={tab}
            onClick={() => setActiveTab(tab)}
            role="tab"
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="library-list">{renderList()}</div>

      {activeTab === 'Read' && (
        <p className="library-note">Your ratings make your recommendations smarter.</p>
      )}
    </main>
  );
}
