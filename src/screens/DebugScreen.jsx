import TopBar from '../components/TopBar.jsx';
import { recommend } from '../logic/recommender.js';
import './DebugScreen.css';

const examples = [
  {
    id: 'cozy-greek-read',
    title: 'Cozy Greek read',
    context: {
      mood: 'calm',
      gives: 'comfort me',
      length: 'short',
      filters: { setting: 'Greece', pace: 'slow-burn' },
      profile: { favoriteGenres: ['Classics', 'Contemporary'] },
      library: { saved: [], reading: [], read: [], favorites: [], ratings: {}, notForMe: [] },
    },
  },
  {
    id: 'twisty-page-turner',
    title: 'A twisty page-turner',
    context: {
      mood: 'restless',
      gives: 'thrill me',
      length: 'medium',
      filters: { ending: 'twist', pace: 'page-turner' },
      profile: { favoriteGenres: ['Mystery/Thriller', 'Sci-Fi'] },
      library: { saved: [], reading: [], read: [], favorites: [], ratings: {}, notForMe: [] },
    },
  },
  {
    id: 'thoughtful-classic',
    title: 'A thoughtful classic',
    context: {
      mood: 'nostalgic',
      gives: 'make me think',
      length: 'long',
      filters: { period: 'historical', standalone: true },
      profile: { favoriteGenres: ['Classics', 'Historical'] },
      library: { saved: [], reading: [], read: [], favorites: [], ratings: {}, notForMe: [] },
    },
  },
];

function RecommendationItem({ label, result }) {
  return (
    <li className="debug-recommendation">
      <div className="debug-recommendation__heading">
        <strong>{label}</strong>
        <span>{result.book.title} by {result.book.author}</span>
        <span>{result.matchPercent}% match</span>
      </div>
      <ul className="debug-recommendation__reasons">
        {result.reasons.map((reason) => <li key={reason}>{reason}</li>)}
      </ul>
    </li>
  );
}

export default function DebugScreen() {
  return (
    <main className="debug-screen">
      <TopBar title="Recommendation Debug" backTo="/home" />
      <div className="debug-screen__content">
        {examples.map(({ id, title, context }) => {
          const { mainPick, alternatives } = recommend(context);
          if (!mainPick) return null;

          return (
            <section aria-labelledby={`debug-${id}`} className="debug-example" key={id}>
              <h1 id={`debug-${id}`}>{title}</h1>
              <ul className="debug-recommendation-list">
                <RecommendationItem label="Main pick" result={mainPick} />
                {alternatives.map((result) => (
                  <RecommendationItem key={result.label} label={result.label} result={result} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}