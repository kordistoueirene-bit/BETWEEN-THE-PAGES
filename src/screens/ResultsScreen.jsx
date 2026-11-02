import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, Bookmark, Check, ChevronRight, Clock3, Eye, Sparkles, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BookCover from '../components/BookCover.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import { estimateReadingTime, recommend } from '../logic/recommender.js';
import { GIVES, LENGTHS, MOODS } from '../data/taxonomy.js';
import './ResultsScreen.css';

const moodLabels = Object.fromEntries(MOODS.map((option) => [option.id, option.label]));
const giveLabels = Object.fromEntries(GIVES.map((give) => [give.toLowerCase(), give]));
const lengthLabels = Object.fromEntries(LENGTHS.map((option) => [option.id, option.label]));

function buildSearchSummary(search = {}) {
  const chips = [];

  if (search.mood) {
    chips.push(`😊 ${moodLabels[search.mood] || search.mood}`);
  }

  const gives = Array.isArray(search.gives) ? search.gives : [];
  if (gives.length) {
    chips.push(...gives.map((give) => (giveLabels[give.toLowerCase()] || give)));
  }

  if (search.length) {
    chips.push(lengthLabels[search.length] || search.length);
  }

  const filters = search.filters || {};
  if (Array.isArray(filters.ending) && filters.ending.length) {
    chips.push(...filters.ending);
  }
  if (Array.isArray(filters.setting) && filters.setting.length) {
    chips.push(...filters.setting);
  }
  if (Array.isArray(filters.pace) && filters.pace.length) {
    chips.push(...filters.pace);
  }
  if (Array.isArray(filters.period) && filters.period.length) {
    chips.push(...filters.period);
  }
  if (filters.era) {
    chips.push(filters.era);
  }

  if (search.query?.trim()) {
    chips.push(search.query.trim().slice(0, 26));
  }

  return chips.slice(0, 6);
}

export default function ResultsScreen() {
  const navigate = useNavigate();
  const { userProfile, library, lastSearch, toggleInList, markNotForMe } = useAppContext();
  const [toast, setToast] = useState('');
  const [activeBookId, setActiveBookId] = useState(null);
  const [spoilerVisible, setSpoilerVisible] = useState(false);

  const recommendation = useMemo(() => {
    const search = lastSearch || {
      profile: userProfile,
      mood: '',
      gives: [],
      length: '',
      filters: {},
      query: '',
      library,
    };

    return recommend({ ...search, profile: userProfile || search.profile, library });
  }, [lastSearch, library, userProfile]);

  const mainPick = recommendation?.mainPick || null;
  const alternatives = recommendation?.alternatives || [];

  useEffect(() => {
    if (!mainPick) {
      setActiveBookId(null);
      setSpoilerVisible(false);
      return;
    }

    setActiveBookId((current) => {
      const validIds = [mainPick.book.id, ...alternatives.map((item) => item.book.id)];
      if (!current || !validIds.includes(current)) {
        return mainPick.book.id;
      }
      return current;
    });
    setSpoilerVisible(false);
  }, [alternatives, mainPick]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const searchSummary = useMemo(() => buildSearchSummary(lastSearch), [lastSearch]);

  const activeEntry = useMemo(() => {
    if (!mainPick) return null;
    if (activeBookId === mainPick.book.id) return mainPick;
    return alternatives.find((item) => item.book.id === activeBookId) || mainPick;
  }, [activeBookId, alternatives, mainPick]);

  const isSaved = activeEntry ? library.saved.includes(activeEntry.book.id) : false;
  const isReading = activeEntry ? library.reading.includes(activeEntry.book.id) : false;
  const shouldRevealSpoiler = (lastSearch?.filters?.spoilers === 'show') || (userProfile?.settings?.spoilersDefault === 'show');
  const matchLabel = mainPick ? `${mainPick.matchPercent}% match` : 'No match';
  const noPerfectMatch = !mainPick || mainPick.matchPercent < 90;

  if (!mainPick || !activeEntry) {
    return (
      <main className="results-screen results-screen--empty">
        <header className="results-header">
          <Link aria-label="Back to mood finder" className="results-back" to="/mood">
            <ArrowLeft size={20} />
          </Link>
        </header>
        <div className="results-empty-state">
          <h1>No picks yet</h1>
          <p>Try a few different mood filters to get a stronger match.</p>
          <Link className="ui-link" to="/mood">Back to Mood Finder</Link>
        </div>
      </main>
    );
  }

  const handleSaveToggle = () => {
    toggleInList('saved', activeEntry.book.id);
    setToast(isSaved ? 'Removed from saved' : 'Saved to your library');
  };

  const handleStartReading = () => {
    toggleInList('reading', activeEntry.book.id);
    navigate('/library');
  };

  const handleNotForMe = () => {
    markNotForMe(activeEntry.book.id);
    setToast('Got it — here\'s another one');
    const nextResults = recommend({
      ...(lastSearch || { query: '', mood: '', gives: [], length: '', filters: {}, profile: userProfile }),
      profile: userProfile,
      library: {
        ...library,
        notForMe: [...new Set([...library.notForMe, activeEntry.book.id])],
      },
    });

    if (nextResults.mainPick) {
      setActiveBookId(nextResults.mainPick.book.id);
    }
  };

  const handleRevealSpoiler = () => {
    if (shouldRevealSpoiler || window.confirm('Show the ending for this book?')) {
      setSpoilerVisible(true);
    }
  };

  const readingTime = estimateReadingTime(activeEntry.book.pages, Number(userProfile?.minutesPerDay) || 20);

  return (
    <main className="results-screen">
      <header className="results-header">
        <Link aria-label="Back to mood finder" className="results-back" to="/mood">
          <ArrowLeft size={20} />
        </Link>

        <div className="results-summary" aria-label="Search summary">
          {searchSummary.map((chip, index) => (
            <span className="results-chip" key={`${chip}-${index}`}>
              {chip}
            </span>
          ))}
        </div>

        <Link className="results-edit" to="/mood">Edit</Link>
      </header>

      {noPerfectMatch && (
        <div className="results-banner">No perfect match — these are the closest</div>
      )}

      <section className="results-hero" aria-live="polite">
        <div className="results-poster-wrap">
          <div className="results-match-badge">{matchLabel}</div>
          <BookCover book={activeEntry.book} className="results-poster" size="poster" />
        </div>

        <div className="results-hero__meta">
          <div className="results-book-heading">
            <h1>{activeEntry.book.title}</h1>
            <p>{activeEntry.book.author}</p>
          </div>

          <div className="results-rating-row" aria-label={`Rated ${activeEntry.book.rating} stars`}>
            <Star fill="currentColor" size={15} />
            <span>{activeEntry.book.rating.toFixed(1)}</span>
          </div>

          <div className="results-meta-row">
            <span>{activeEntry.book.pages} pages</span>
            <span>{readingTime}</span>
          </div>
        </div>
      </section>

      <section className="results-card results-card--reasons">
        <div className="results-card__header">
          <Sparkles size={16} />
          <h2>Why this book</h2>
        </div>

        <ul className="results-reasons-list">
          {activeEntry.reasons.map((reason) => (
            <li key={reason}>
              <span className="results-reason-icon">
                <Check size={12} />
              </span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="results-card results-card--summary">
        <div className="results-card__header">
          <Eye size={16} />
          <h2>What it feels like</h2>
        </div>

        {shouldRevealSpoiler ? (
          <div className="results-spoiler results-spoiler--blurred">
            <p className={spoilerVisible ? '' : 'is-blurred'}>{activeEntry.book.spoilerSummary}</p>
            {!spoilerVisible ? (
              <button className="results-spoiler-overlay" onClick={() => setSpoilerVisible(true)} type="button">
                Tap to reveal the ending
              </button>
            ) : (
              <button className="results-spoiler-link" onClick={() => setSpoilerVisible(false)} type="button">
                Hide spoiler
              </button>
            )}
          </div>
        ) : (
          <>
            <p>{activeEntry.book.spoilerFreeSummary}</p>
            <button className="results-spoiler-link" onClick={handleRevealSpoiler} type="button">
              Show spoiler
            </button>
          </>
        )}
      </section>

      <div className="results-actions">
        <button className={`results-action ${isSaved ? 'is-active' : ''}`} onClick={handleSaveToggle} type="button">
          <Bookmark size={16} />
          <span>Save</span>
        </button>

        <button className={`results-action ${isReading ? 'is-active' : ''}`} onClick={handleStartReading} type="button">
          <BookOpen size={16} />
          <span>Start reading</span>
        </button>

        <button className="results-action results-action--ghost" onClick={handleNotForMe} type="button">
          <ChevronRight size={16} />
          <span>Not for me</span>
        </button>
      </div>

      <section className="results-alternatives">
        <div className="results-section-header">
          <h2>Other options for you</h2>
        </div>

        <div className="results-alternative-list" role="list">
          {alternatives.map((option) => {
            const isCurrent = activeBookId === option.book.id;
            return (
              <button
                aria-label={`${option.label}: ${option.book.title}`}
                className={`results-alternative ${isCurrent ? 'is-current' : ''}`}
                key={option.book.id}
                onClick={() => {
                  if (isCurrent) {
                    navigate(`/book/${option.book.id}`, { state: { fromTab: 'home' } });
                    return;
                  }
                  setActiveBookId(option.book.id);
                }}
                type="button"
              >
                <span className="results-alternative__label">{option.label}</span>
                <BookCover book={option.book} size="lg" />
                <span className="results-alternative__title">{option.book.title}</span>
                <span className="results-alternative__meta">{option.matchPercent}% match</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="results-footer">
        <Link className="results-footer__link" to="/mood">
          Not quite right? Try different questions
        </Link>
      </div>

      {toast && (
        <div aria-live="polite" className="results-toast">
          {toast}
        </div>
      )}
    </main>
  );
}
