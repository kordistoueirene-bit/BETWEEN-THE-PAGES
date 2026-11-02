import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import BookCover from '../components/BookCover.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import { getHomeRecommendations, getTimelyCollections } from '../logic/recommender.js';
import './CollectionScreen.css';

const sectionLabels = {
  'picked-for-you': 'Picked for you',
  trending: 'Trending this week',
  'coming-to-screen': 'Coming to screen soon',
  'coming-to-screen-soon': 'Coming to screen soon',
  seasonal: 'Cozy autumn reads',
  'cozy-autumn-reads': 'Cozy autumn reads',
  'popular-with-readers-like-you': 'Popular with readers like you',
};

export default function CollectionScreen() {
  const { key } = useParams();
  const { userProfile, library } = useAppContext();
  const recommendations = getHomeRecommendations(userProfile, library);
  const collections = getTimelyCollections(userProfile);

  const becauseYouLoved = recommendations.becauseYouLoved || [];
  const collectionMap = {
    'picked-for-you': { title: sectionLabels['picked-for-you'], books: recommendations.pickedForYou?.slice(0, 20) || [] },
    trending: { title: sectionLabels.trending, books: collections.trending?.slice(0, 20) || [] },
    'coming-to-screen': { title: sectionLabels['coming-to-screen'], books: collections.comingToScreen?.slice(0, 20) || [] },
    'coming-to-screen-soon': { title: sectionLabels['coming-to-screen-soon'], books: collections.comingToScreen?.slice(0, 20) || [] },
    seasonal: { title: sectionLabels.seasonal, books: collections.seasonal?.slice(0, 20) || [] },
    'cozy-autumn-reads': { title: sectionLabels['cozy-autumn-reads'], books: collections.seasonal?.slice(0, 20) || [] },
    'popular-with-readers-like-you': { title: sectionLabels['popular-with-readers-like-you'], books: recommendations.popularWithReadersLikeYou?.slice(0, 20) || [] },
  };

  becauseYouLoved.forEach((section) => {
    const slug = `because-you-loved-${section.sourceBook.id}`;
    collectionMap[slug] = {
      title: section.title,
      books: section.books?.slice(0, 20) || [],
    };
  });

  const collection = collectionMap[key] || null;
  const books = collection?.books || [];

  return (
    <main className="collection-screen">
      <header className="collection-header">
        <Link aria-label="Back to home" className="collection-header__back" to="/home">
          <ArrowLeft aria-hidden="true" size={20} />
        </Link>
        <h1>{collection?.title || 'Collection'}</h1>
        <span aria-hidden="true" className="collection-header__spacer" />
      </header>

      {!collection ? (
        <div className="collection-empty">
          <p>No books here yet</p>
          <Link className="collection-empty__button" to="/home">Back to Home</Link>
        </div>
      ) : books.length === 0 ? (
        <div className="collection-empty">
          <p>No books here yet</p>
          <Link className="collection-empty__button" to="/home">Back to Home</Link>
        </div>
      ) : (
        <div className="collection-grid">
          {books.map((book) => (
            <Link className="collection-book" key={book.id} state={{ fromTab: 'home' }} to={`/book/${book.id}`}>
              <BookCover book={book} size="lg" />
              <div className="collection-book__meta">
                <strong>{book.title}</strong>
                <span>{book.author}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
