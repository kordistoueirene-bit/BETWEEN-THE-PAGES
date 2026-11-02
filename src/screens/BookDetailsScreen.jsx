import { useMemo, useState } from 'react';
import { ArrowLeft, Bookmark, BookOpen, Check, Eye, Heart, Sparkles, Star } from 'lucide-react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import BookCover from '../components/BookCover.jsx';
import { BOOKS } from '../data/index.js';
import { useAppContext } from '../context/AppContext.jsx';
import { estimateReadingTime, scoreBook } from '../logic/recommender.js';
import './BookDetailsScreen.css';

const tabs = ['about', 'spoilers', 'details'];

function formatLabel(value) {
  if (value === null || value === undefined || value === '') return 'Not specified';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

export default function BookDetailsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { userProfile, library, settings, toggleInList, rateBook } = useAppContext();
  const [activeTab, setActiveTab] = useState('about');
  const [spoilerVisible, setSpoilerVisible] = useState(settings?.spoilersDefault === 'show');
  const backTarget = location.state?.from === 'notifications' ? '/notifications' : location.state?.from === 'home' ? '/home' : '/results';

  const book = useMemo(() => BOOKS.find((entry) => entry.id === id) || null, [id]);
  const matchData = useMemo(() => {
    if (!book) return null;
    return scoreBook(book, { profile: userProfile, library });
  }, [book, library, userProfile]);

  const readingTime = useMemo(
    () => estimateReadingTime(book?.pages, Number(userProfile?.minutesPerDay) || 20),
    [book, userProfile],
  );

  const isSaved = Boolean(book && library.saved.includes(book.id));
  const isFavorite = Boolean(book && library.favorites.includes(book.id));
  const isReading = Boolean(book && library.reading.includes(book.id));

  const similarBooks = useMemo(() => {
    if (!book) return [];

    return BOOKS.filter((entry) => entry.id !== book.id)
      .map((entry) => {
        const sharedGenres = book.genres.filter((genre) => entry.genres.includes(genre)).length;
        const sharedTropes = book.tropes.filter((trope) => entry.tropes.includes(trope)).length;
        const sharedMoods = book.moods.filter((mood) => entry.moods.includes(mood)).length;
        const score = sharedGenres * 4 + sharedTropes * 3 + sharedMoods * 2;

        return { ...entry, similarityScore: score };
      })
      .filter((entry) => entry.similarityScore > 0)
      .sort((left, right) => right.similarityScore - left.similarityScore || left.title.localeCompare(right.title))
      .slice(0, 5);
  }, [book]);

  const trendingRank = useMemo(() => {
    if (!book || book.timely.trendingScore < 75) return null;
    const ranked = [...BOOKS]
      .filter((entry) => entry.timely.trendingScore >= 75)
      .sort((left, right) => right.timely.trendingScore - left.timely.trendingScore || left.id.localeCompare(right.id));

    const rankIndex = ranked.findIndex((entry) => entry.id === book.id);
    return rankIndex >= 0 ? rankIndex + 1 : null;
  }, [book]);

  if (!book) {
    return (
      <main className="book-detail-screen book-detail-screen--empty">
        <header className="book-detail__header book-detail__header--empty">
          <Link aria-label="Back to home" className="book-detail__back" to="/home">
            <ArrowLeft size={20} />
          </Link>
        </header>
        <div className="book-detail__empty">
          <h1>Book not found</h1>
          <Link className="book-detail__link" to="/home">Back home</Link>
        </div>
      </main>
    );
  }

  const handleSaveToggle = () => {
    toggleInList('saved', book.id);
  };

  const handleFavoriteToggle = () => {
    toggleInList('favorites', book.id);
  };

  const handleStartReading = () => {
    toggleInList('reading', book.id);
    navigate('/library');
  };

  const handleMarkAsRead = () => {
    toggleInList('read', book.id);
    const rating = window.prompt('Rate this book from 1 to 5', '5');
    const parsedRating = Number(rating);
    if (Number.isFinite(parsedRating) && parsedRating >= 1 && parsedRating <= 5) {
      rateBook(book.id, parsedRating);
    }
  };

  const tabContent = {
    about: (
      <div className="book-detail__content-section">
        <div className="book-detail__hook">{book.hook}</div>
        <p>{book.spoilerFreeSummary}</p>
      </div>
    ),
    spoilers: (
      <div className="book-detail__content-section">
        <div className={`book-detail__spoiler ${spoilerVisible ? 'is-visible' : ''}`}>
          <p>{book.spoilerSummary}</p>
          {!spoilerVisible && (
            <button className="book-detail__spoiler-toggle" onClick={() => setSpoilerVisible(true)} type="button">
              Tap to reveal the ending
            </button>
          )}
        </div>
        <div className="book-detail__detail-list">
          <div className="book-detail__detail-row">
            <span>Ending</span>
            <strong>{book.ending}</strong>
          </div>
        </div>
      </div>
    ),
    details: (
      <div className="book-detail__content-section">
        <div className="book-detail__detail-list">
          <div className="book-detail__detail-row"><span>Setting</span><strong>{formatLabel(book.setting)}</strong></div>
          <div className="book-detail__detail-row"><span>Period</span><strong>{formatLabel(book.period)}</strong></div>
          <div className="book-detail__detail-row"><span>POV</span><strong>{formatLabel(book.pov)}</strong></div>
          <div className="book-detail__detail-row"><span>Tropes</span><strong>{formatLabel(book.tropes)}</strong></div>
          <div className="book-detail__detail-row"><span>Content warnings</span><strong>{formatLabel(book.contentWarnings)}</strong></div>
          <div className="book-detail__detail-row"><span>Languages</span><strong>{formatLabel(book.languages)}</strong></div>
          <div className="book-detail__detail-row"><span>Formats</span><strong>{formatLabel(book.formats)}</strong></div>
          <div className="book-detail__detail-row"><span>Series</span><strong>{book.series ? 'Series' : 'Standalone'}</strong></div>
        </div>
      </div>
    ),
  };

  return (
    <main className="book-detail-screen">
      <div className="book-detail__hero" style={{ '--book-bg': book.cover.bg, '--book-accent': book.cover.accent }}>
        <header className="book-detail__header">
          <Link aria-label="Back" className="book-detail__back" to={backTarget}>
            <ArrowLeft size={20} />
          </Link>
          <button
            aria-label={isSaved ? 'Remove from want to read' : 'Save to want to read'}
            aria-pressed={isSaved}
            className="book-detail__bookmark"
            onClick={handleSaveToggle}
            type="button"
          >
            <Bookmark fill={isSaved ? 'currentColor' : 'none'} size={18} />
          </button>
        </header>

        <div className="book-detail__cover-wrap">
          <BookCover book={book} className="book-detail__cover" size="lg" />
        </div>
      </div>

      <div className="book-detail__body">
        <div className="book-detail__topline">
          <div className="book-detail__meta-block">
            <h1>{book.title}</h1>
            <p>{book.author} · {book.year}</p>
          </div>
          <div className="book-detail__rating" aria-label={`Rated ${book.rating} out of 5`}>
            <Star fill="currentColor" size={15} />
            <span>{book.rating.toFixed(1)}</span>
            <small>({book.ratingsCount.toLocaleString()})</small>
          </div>
        </div>

        <div className="book-detail__chips">
          {book.genres.map((genre) => <span className="book-detail__chip" key={genre}>{genre}</span>)}
          <span className="book-detail__chip">{book.pages} pages</span>
          <span className="book-detail__chip">{readingTime}</span>
          <span className="book-detail__chip">{book.pace}</span>
          <span className="book-detail__chip">{book.style}</span>
        </div>

        <div className="book-detail__badges">
          {trendingRank && <span className="book-detail__badge book-detail__badge--hot">🔥 #{trendingRank} trending</span>}
          {book.timely.isNewRelease && <span className="book-detail__badge book-detail__badge--new">New release</span>}
          {book.timely.adaptation?.when === 'Coming soon' && (
            <span className="book-detail__badge book-detail__badge--screen">🎬 {book.timely.adaptation.type === 'film' ? 'Film' : 'Series'} coming soon</span>
          )}
          {book.timely.award && <span className="book-detail__badge book-detail__badge--award">🏆 {book.timely.award}</span>}
        </div>

        <div className="book-detail__tabs" role="tablist" aria-label="Book information tabs">
          {tabs.map((tab) => (
            <button
              aria-selected={activeTab === tab}
              className={`book-detail__tab ${activeTab === tab ? 'is-active' : ''}`}
              key={tab}
              onClick={() => setActiveTab(tab)}
              role="tab"
              type="button"
            >
              {tab === 'about' ? 'About' : tab === 'spoilers' ? 'Spoilers' : 'Details'}
            </button>
          ))}
        </div>

        {tabContent[activeTab]}

        <div className="book-detail__match-card">
          <div className="book-detail__match-header">
            <Sparkles size={16} />
            <h2>Is it for me?</h2>
          </div>

          <div className="book-detail__match-score">
            <strong>{matchData?.score ?? 0}%</strong>
            <span>match</span>
          </div>

          <ul className="book-detail__reasons">
            {(matchData?.reasons ?? []).slice(0, 3).map((reason) => (
              <li key={reason}><Check size={12} /> {reason}</li>
            ))}
          </ul>
        </div>

        <div className="book-detail__actions">
          <button className="book-detail__action book-detail__action--primary" onClick={handleStartReading} type="button">
            <BookOpen size={16} />
            <span>Start reading</span>
          </button>
          <button className="book-detail__action" onClick={handleMarkAsRead} type="button">
            <Eye size={16} />
            <span>Mark as read</span>
          </button>
          <button className={`book-detail__action ${isFavorite ? 'is-active' : ''}`} onClick={handleFavoriteToggle} type="button">
            <Heart fill={isFavorite ? 'currentColor' : 'none'} size={16} />
            <span>Add to favorites</span>
          </button>
        </div>

        <section className="book-detail__similar">
          <div className="book-detail__similar-header">
            <h2>Readers who liked this also liked</h2>
          </div>
          <div className="book-detail__similar-list">
            {similarBooks.map((entry) => (
              <Link className="book-detail__similar-item" key={entry.id} to={`/book/${entry.id}`}>
                <BookCover book={entry} size="sm" />
                <div>
                  <strong>{entry.title}</strong>
                  <span>{entry.author}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
