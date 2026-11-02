import { Link } from 'react-router-dom';
import BookCover from '../components/BookCover.jsx';
import Button from '../components/Button.jsx';
import { BOOKS } from '../data/index.js';
import TopBar from '../components/TopBar.jsx';
import './PlaceholderScreen.css';

export default function PlaceholderScreen({ name, navigationPaths }) {
  const primaryPath = name === 'Welcome' ? '/onboarding' : '/home';
  const primaryLabel = name === 'Welcome' ? 'Start' : 'Continue to Home';

  return (
    <main className="placeholder-screen">
      <TopBar title={name} backTo={name === 'Welcome' ? undefined : '/home'} />
      <section className="placeholder-content" aria-labelledby="screen-heading">
        <p className="placeholder-eyebrow">Between the Pages</p>
        <h1 id="screen-heading">{name}</h1>
        <p className="placeholder-copy">This screen is ready for its next step.</p>
        <Button to={primaryPath}>{primaryLabel}</Button>
        {name === 'Explore' && (
          <section aria-labelledby="cover-review-heading" className="explore-cover-section">
            <h2 id="cover-review-heading">Mock book covers</h2>
            <div className="explore-cover-grid">
              {BOOKS.map((book) => (
                <figure className="explore-cover-item" key={book.id}>
                  <BookCover book={book} size="sm" />
                  <figcaption>{book.title}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
        <div className="placeholder-route-list">
          <h2>Explore screens</h2>
          {navigationPaths.map(({ path, name: routeName }) => (
            <Link
              className="placeholder-route-link"
              key={path}
              to={path}
              aria-current={path === window.location.hash.slice(1) ? 'page' : undefined}
            >
              {routeName}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}