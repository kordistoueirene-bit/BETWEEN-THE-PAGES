# Between the Pages

Between the Pages is a mobile-first, interactive book-discovery mockup. It helps readers get from an overflowing choice of books to one that fits their tastes, current mood, and very specific wishes. It uses local mock data and browser storage; there is no backend or external API.

## How recommendations work

- **Content-based scoring:** profile genre affinity is worth up to 8 points, language and format matches add 2.5 points each, and books sharing themes with loved books add 2 points. Mood matches add 20 points, desired emotional outcome adds 20, and length adds 10.
- **Specific preferences:** pace, ending, point of view, setting, period, style, tropes, language, format, and other filters contribute to the score.
- **Hard exclusions:** avoided content, excluded genres, rejected books, and other disqualifying filters are removed before ranking.
- **Feedback loop:** ratings and “Not for me” feedback adjust or exclude similar future picks.
- **Timely boost:** trending, new-release, screen-adaptation, and seasonal signals add up to 5 points.
- **Readable results:** each recommendation includes reasons drawn from the preferences and signals that matched.

## Screens

- Welcome and step-by-step reading-profile onboarding
- Home recommendations and first-time app tour
- Mood Finder with free-text search, quick questions, and specific filters
- Results with a main pick, match reasons, alternatives, save, and feedback actions
- Book details with metadata, spoiler controls, and similar books
- Explore for trending titles, new releases, adaptations, seasonal picks, and awards
- My Library with Want to read, Reading, Read, and Favorites lists
- Profile, editable reading preferences, quick quiz, and settings

## Tech stack

- React 18 and Vite, using JavaScript
- React Router with `HashRouter`
- Plain CSS with shared theme variables and dark-mode support
- `lucide-react` icons
- React Context and `localStorage` for local persistence
- Curated mock book data; no backend, external APIs, or real cover images

## Demo path for a new user

Start -> onboarding -> Home -> mood bar -> Get specific -> Results -> Save -> Library -> Profile

## Run locally

```bash
npm install
npm run dev
```