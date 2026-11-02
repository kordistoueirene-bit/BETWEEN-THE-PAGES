import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Bell, Leaf, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BookCover from '../components/BookCover.jsx';
import Card from '../components/Card.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import { getHomeRecommendations, getTimelyCollections, scoreBook } from '../logic/recommender.js';
import './HomeScreen.css';

function BookShelf({ title, ariaLabel = title, books, size = 'sm', badgeForBook, className = '', sectionKey }) {
  if (!books?.length) return null;

  return (
    <section aria-label={ariaLabel} className={['home-section', className].filter(Boolean).join(' ')}>
      <header className="home-section__header">
        <h2>{title}</h2>
        <Link className="home-see-more" to={`/collection/${sectionKey}`}>See more</Link>
      </header>
      <div aria-label={`${ariaLabel} books`} className="home-shelf" role="region" tabIndex={0}>
        {books.map((book, index) => {
          const badge = badgeForBook?.(book, index);
          return (
            <Link
              aria-label={`${book.title} by ${book.author}${badge ? `, ${badge}` : ''}`}
              className={`home-book home-book--${size}`}
              key={book.id}
              state={{ fromTab: 'home' }}
              to={`/book/${book.id}`}
            >
              <span className="home-book__cover-wrap">
                <BookCover book={book} size={size} />
                {badge && <span className="home-book__badge">{badge}</span>}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function HomeScreen() {
  const navigate = useNavigate();
  const { userProfile, library, settings, updateSettings, unreadNotifications } = useAppContext();
  const [tourStep, setTourStep] = useState(null);
  const [tourPosition, setTourPosition] = useState(null);
  const name = userProfile?.name?.trim() || 'reader';
  const initial = name.charAt(0).toUpperCase();
  const profilePhoto = userProfile?.avatar;
  const favoriteGenres = Array.isArray(userProfile?.favoriteGenres) ? userProfile.favoriteGenres : [];
  const booksLoved = Array.isArray(userProfile?.booksLoved) ? userProfile.booksLoved : [];
  const hasLittleProfileData = !userProfile || (favoriteGenres.length <= 1 && booksLoved.length === 0);
  const recommendations = getHomeRecommendations(userProfile, library);
  const collections = getTimelyCollections(userProfile);

  useEffect(() => {
    if (!settings.hasSeenAppTour) setTourStep(0);
  }, [settings.hasSeenAppTour]);

  useEffect(() => {
    if (tourStep === null) return undefined;

    const selectors = [
      '.home-mood-link',
      '.bottom-nav__item[aria-label="Explore"]',
      '.bottom-nav__item[aria-label="Profile"]',
    ];
    const target = document.querySelector(selectors[tourStep]);
    if (!target) return undefined;

    const placeTour = () => {
      const bounds = target.getBoundingClientRect();
      const cardWidth = Math.min(290, window.innerWidth - 32);
      const left = Math.max(16, Math.min(window.innerWidth - cardWidth - 16, bounds.left + bounds.width / 2 - cardWidth / 2));
      const top = bounds.top + bounds.height + 14 < window.innerHeight - 170
        ? bounds.top + bounds.height + 14
        : Math.max(16, bounds.top - 154);

      setTourPosition({
        left,
        top,
        targetLeft: bounds.left - 6,
        targetTop: bounds.top - 6,
        targetWidth: bounds.width + 12,
        targetHeight: bounds.height + 12,
      });
    };

    placeTour();
    window.addEventListener('resize', placeTour);
    window.addEventListener('scroll', placeTour, true);
    return () => {
      window.removeEventListener('resize', placeTour);
      window.removeEventListener('scroll', placeTour, true);
    };
  }, [tourStep]);

  const finishTour = () => {
    setTourStep(null);
    setTourPosition(null);
    updateSettings({ hasSeenAppTour: true });
  };

  const tourSteps = [
    { title: 'Find your next read', copy: 'Tell us what you are in the mood for, then make the search as specific as you like.' },
    { title: 'Explore what is happening', copy: 'Browse timely picks, new releases, adaptations, seasonal reads, and award winners.' },
    { title: 'Make it yours', copy: 'Update your reading profile, discover your reading personality, and change app settings.' },
  ];

  return (
    <main className="home-screen">
      <header className="home-header">
        {profilePhoto ? (
          <img alt={`${name} avatar`} className="home-avatar home-avatar--photo" src={profilePhoto} />
        ) : (
          <span aria-hidden="true" className="home-avatar">{initial}</span>
        )}
        <div className="home-greeting">
          <p>Happy reading,</p>
          <h1>{name}</h1>
        </div>
        {settings.notifications ? (
          <button
            aria-label="Open notifications"
            className="home-notifications-button"
            onClick={() => navigate('/notifications')}
            type="button"
          >
            <Bell aria-hidden="true" size={20} strokeWidth={1.8} />
            {unreadNotifications && <span aria-label="Unread notifications" className="home-notifications-button__dot" />}
          </button>
        ) : null}
      </header>

      <Link aria-label="What are you in the mood to read?" className="home-mood-link" to="/mood">
        <Search aria-hidden="true" size={21} strokeWidth={1.8} />
        <span>What are you in the mood to read?</span>
      </Link>

      {hasLittleProfileData && (
        <Card className="home-profile-prompt">
          <div>
            <h2>Tell us more to get better picks</h2>
            <p>A few more details can make your recommendations feel more like you.</p>
          </div>
          <Link aria-label="Edit your profile" className="home-profile-prompt__link" to="/profile/edit">
            <span>Update profile</span>
            <span aria-hidden="true">→</span>
          </Link>
        </Card>
      )}

      <div className="home-sections">
        <BookShelf
          badgeForBook={(book) => `${scoreBook(book, { profile: userProfile, library })?.score ?? 0}% match`}
          books={recommendations.pickedForYou}
          className="home-section--featured"
          sectionKey="picked-for-you"
          size="md"
          title="Picked for you"
        />

        <BookShelf
          ariaLabel="Trending this week"
          badgeForBook={(_book, index) => `${index + 1}`}
          books={collections.trending}
          sectionKey="trending"
          title={<>{'Trending this week'} <span aria-hidden="true">🔥</span></>}
        />

        {recommendations.becauseYouLoved.map((section) => (
          <BookShelf
            books={section.books}
            key={section.sourceBook.id}
            sectionKey={`because-you-loved-${section.sourceBook.id}`}
            title={section.title}
          />
        ))}

        <BookShelf
          ariaLabel="Coming to screen soon"
          badgeForBook={(book) => book.timely.adaptation.type === 'film' ? 'Film' : 'Series'}
          books={collections.comingToScreen}
          sectionKey="coming-to-screen"
          title={<>Coming to screen soon <span aria-hidden="true">🎬</span></>}
        />

        <BookShelf
          ariaLabel="Cozy autumn reads"
          books={collections.seasonal}
          sectionKey="seasonal"
          title={<>Cozy autumn reads <Leaf aria-hidden="true" size={17} /></>}
        />
      </div>

      {tourStep !== null && tourPosition && createPortal((
        <>
          <div
            aria-hidden="true"
            className="app-tour-spotlight"
            style={{
              left: tourPosition.targetLeft,
              top: tourPosition.targetTop,
              width: tourPosition.targetWidth,
              height: tourPosition.targetHeight,
            }}
          />
          <section
            aria-describedby="app-tour-copy"
            aria-labelledby="app-tour-title"
            aria-modal="true"
            className="app-tour-card"
            role="dialog"
            style={{ left: tourPosition.left, top: tourPosition.top }}
          >
            <p className="app-tour-count">{tourStep + 1} of {tourSteps.length}</p>
            <h2 id="app-tour-title">{tourSteps[tourStep].title}</h2>
            <p id="app-tour-copy">{tourSteps[tourStep].copy}</p>
            <div className="app-tour-actions">
              <button className="app-tour-dismiss" onClick={finishTour} type="button">Got it</button>
              {tourStep < tourSteps.length - 1 ? (
                <button className="app-tour-next" onClick={() => setTourStep((current) => current + 1)} type="button">Next</button>
              ) : null}
            </div>
          </section>
        </>
      ), document.body)}
    </main>
  );
}