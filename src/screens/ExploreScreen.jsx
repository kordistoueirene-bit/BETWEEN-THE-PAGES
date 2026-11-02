import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BookCover from '../components/BookCover.jsx';
import { BOOKS } from '../data/index.js';
import { GENRES } from '../data/taxonomy.js';
import { getTimelyCollections, scoreBook } from '../logic/recommender.js';
import { useAppContext } from '../context/AppContext.jsx';
import './ExploreScreen.css';

const TABS = ['Trending', 'New', 'On screen', 'Seasonal', 'Awards'];

const badgeText = (book) => {
  if (!book.timely?.adaptation) return '';
  return book.timely.adaptation.when === 'Coming soon' ? 'Coming soon' : 'Now streaming';
};

const movementText = (index) => `↑ ${Math.max(1, 10 - index)} this week`;

export default function ExploreScreen() {
  const { userProfile, library } = useAppContext();
  const [activeTab, setActiveTab] = useState('Trending');
  const [activeGenre, setActiveGenre] = useState('All');

  const collections = useMemo(() => getTimelyCollections(userProfile), [userProfile]);

  const genres = useMemo(() => ['All', ...GENRES], []);

  const filterBooks = (books) => {
    if (activeGenre === 'All') return books;
    return books.filter((book) => book.genres.includes(activeGenre));
  };

  const trendingBooks = useMemo(() => filterBooks(collections.trending.slice(0, 10)), [collections.trending, activeGenre]);
  const newBooks = useMemo(() => filterBooks(collections.newReleases), [collections.newReleases, activeGenre]);
  const onScreenBooks = useMemo(() => filterBooks(BOOKS.filter((book) => book.timely?.adaptation)), [activeGenre]);
  const seasonalBooks = useMemo(() => filterBooks(collections.seasonal), [collections.seasonal, activeGenre]);
  const awardsMap = useMemo(() => {
    const grouped = new Map();
    BOOKS.filter((book) => book.timely?.award)
      .forEach((book) => {
        const existing = grouped.get(book.timely.award) || [];
        grouped.set(book.timely.award, [...existing, book]);
      });

    return [...grouped.entries()].map(([award, books]) => [award, filterBooks(books)]);
  }, [activeGenre]);

  const renderMatch = (book) => {
    const scored = scoreBook(book, { profile: userProfile, library });
    return `${scored?.score ?? 0}% match`;
  };

  const renderTrending = () => (
    <div className="explore-list">
      {trendingBooks.map((book, index) => (
        <Link className="explore-rank-item" key={book.id} state={{ fromTab: 'explore' }} to={`/book/${book.id}`}>
          <div className="explore-rank-item__rank">#{index + 1}</div>
          <BookCover book={book} size="sm" />
          <div className="explore-rank-item__details">
            <strong>{book.title}</strong>
            <span>{book.author}</span>
          </div>
          <div className="explore-rank-item__meta">
            <span className="explore-movement">{movementText(index)}</span>
            <span className="explore-match">{renderMatch(book)}</span>
          </div>
        </Link>
      ))}
    </div>
  );

  const renderNew = () => (
    <div className="explore-grid">
      {newBooks.map((book) => (
        <Link className="explore-book-card" key={book.id} state={{ fromTab: 'explore' }} to={`/book/${book.id}`}>
          <div className="explore-book-card__cover-wrap">
            <BookCover book={book} size="lg" />
            <span className="explore-book-card__badge">NEW</span>
          </div>
          <strong>{book.title}</strong>
          <span>{book.author}</span>
        </Link>
      ))}
    </div>
  );

  const renderOnScreen = () => (
    <div className="explore-screen-list">
      <div className="explore-screen-header">Read it before you watch it</div>
      {onScreenBooks.map((book) => (
        <Link className="explore-screen-item" key={book.id} state={{ fromTab: 'explore' }} to={`/book/${book.id}`}>
          <BookCover book={book} size="sm" />
          <div className="explore-screen-item__details">
            <strong>{book.title}</strong>
            <span>{book.author}</span>
          </div>
          <div className="explore-screen-item__badge-wrap">
            <span className="explore-screen-item__badge">{book.timely.adaptation.type === 'film' ? 'Film' : 'Series'}</span>
            <span className="explore-screen-item__status">{badgeText(book)}</span>
          </div>
        </Link>
      ))}
    </div>
  );

  const renderSeasonal = () => (
    <div className="explore-seasonal">
      <section className="explore-seasonal__group">
        <h3>Cozy November reads 🍂</h3>
        <div className="explore-grid">
          {seasonalBooks.slice(0, 4).map((book) => (
            <Link className="explore-book-card" key={book.id} state={{ fromTab: 'explore' }} to={`/book/${book.id}`}>
              <BookCover book={book} size="lg" />
              <strong>{book.title}</strong>
              <span>{book.author}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="explore-seasonal__group">
        <h3>Winter nights ❄️</h3>
        <div className="explore-grid">
          {seasonalBooks.slice(4, 8).map((book) => (
            <Link className="explore-book-card" key={book.id} state={{ fromTab: 'explore' }} to={`/book/${book.id}`}>
              <BookCover book={book} size="lg" />
              <strong>{book.title}</strong>
              <span>{book.author}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );

  const renderAwards = () => (
    <div className="explore-awards">
      {awardsMap.map(([award, awardBooks]) => (
        <section className="explore-awards__group" key={award}>
          <h3>{award}</h3>
          <div className="explore-grid">
            {awardBooks.map((book) => (
              <Link className="explore-book-card" key={book.id} state={{ fromTab: 'explore' }} to={`/book/${book.id}`}>
                <BookCover book={book} size="lg" />
                <strong>{book.title}</strong>
                <span>{book.author}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );

  const currentTabContent = {
    Trending: renderTrending,
    New: renderNew,
    'On screen': renderOnScreen,
    Seasonal: renderSeasonal,
    Awards: renderAwards,
  }[activeTab];

  return (
    <main className="explore-screen">
      <header className="explore-header">
        <div>
          <h1>Explore</h1>
          <p>Updated weekly</p>
        </div>
      </header>

      <div className="explore-genre-row" aria-label="Browse by genre">
        {genres.map((genre) => (
          <button
            key={genre}
            className={`explore-genre-chip ${activeGenre === genre ? 'is-active' : ''}`}
            onClick={() => setActiveGenre(genre)}
            type="button"
          >
            {genre}
          </button>
        ))}
      </div>

      <div className="explore-tabs" role="tablist" aria-label="Explore tabs">
        {TABS.map((tab) => (
          <button
            aria-selected={activeTab === tab}
            className={`explore-tab ${activeTab === tab ? 'is-active' : ''}`}
            key={tab}
            onClick={() => setActiveTab(tab)}
            role="tab"
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="explore-content">{currentTabContent()}</div>
    </main>
  );
}
