PROJECT OVERVIEW (read carefully before doing anything)

"Between the Pages" is a mobile app that recommends books based on the reader's profile, their
current mood and VERY specific wishes. This is a university assignment (AUEB, Web Analytics):
we are building an INTERACTIVE MOCKUP — it looks and behaves like a real app, but has no backend.
All data is mock data and everything is saved locally (localStorage). A first-time user must be able
to understand and use it with no explanation.

How the app works:
- Welcome screen with the app title and a "Start" button.
- Onboarding questionnaire (one question per screen): name, age range, gender, how often they read,
  favorite genres, books they loved, languages & formats, things they never want in a book,
  daily reading time.
- Home: greeting, and in the top center a big bar "What are you in the mood to read?". Below it,
  sections like "Picked for you", "Trending this week", "Coming to screen soon", "Cozy autumn reads".
- Tapping the bar opens the Mood Finder: the user can type anything (e.g. "a short funny book set in
  Greece with a twist") AND answer 3 quick questions that are NOT always worded the same:
  1) mood (happy, sad, giddy, scared...), 2) what the book should give them (make me happy,
  make me think, escape from everyday life...), 3) length (short / medium / long).
  There is also a "Get specific" section with extremely detailed filters: spoilers allowed or not,
  ending type, pace, writing style, POV, setting, time period, tropes, content to avoid, max pages,
  Greek translation, format, classic vs new, standalone, hidden gems, award winners, has adaptation.
- Results: ONE main recommendation shown as a huge poster with a match % and "Why this book"
  reasons, plus 4 alternative options below (lighter, shorter, classic, trending). "Not for me"
  instantly shows another book and affects future recommendations.
- Book details, Explore (timely: trending, new releases, adaptations, seasonal, awards),
  My Library (want to read, reading, read with ratings, favorites).
- Profile (far right in the bottom nav): edit the onboarding answers, take a quick quiz, reset the
  profile, and Settings (dark mode, spoilers default, notifications, language).
- The core of the app is a content-based RECOMMENDER SYSTEM: every book gets a score from profile +
  mood + specific filters + timely signals + user feedback, with hard exclusions for things the user
  wants to avoid, and readable reasons for each recommendation.

Technical rules (do NOT change):
- React 18 + Vite, JavaScript (no TypeScript), react-router-dom with HashRouter, plain CSS with CSS
  variables (NO Tailwind, NO UI libraries), icons from lucide-react, React Context + localStorage.
- No backend, no external APIs, no real cover images (covers are generated with CSS).
- Shown inside a centered phone frame (390x844) on desktop. UI text in English.
- Folders: src/components, src/screens, src/data, src/logic, src/context, src/styles.
- Routes: / , /onboarding, /home, /explore, /mood, /results, /collection/:key, /notifications,
  /book/:id, /library, /profile, /profile/edit, /profile/quiz, /settings. The bottom nav must stay
  visible on every screen except / and /onboarding, including /mood, /results, /collection/:key,
  /notifications, /book/:id, /profile/edit, /profile/quiz, and /settings. The correct tab stays
  highlighted based on route context: /mood and /results use Home, /settings and /profile/* use
  Profile, /book/:id follows the originating tab from router state, /collection/:key and
  /notifications use Home, and /library only highlights Library when opened from the bottom nav.
  Sticky actions must sit above the nav and all scrollable screens must add bottom padding so
  content is never hidden behind it. Library opened from the Profile menu includes a back arrow to
  /profile; Settings and Edit Profile always include a back arrow to /profile.
- Design: warm, cozy, literary. Colors: cream background #FBF6EC, mustard #F2C46D, soft mustard
  #FBE7BE, dusty pink #E8A5A0, sage #7FB7A8, dark slate ink #2E3440 (text and main buttons),
  muted #8A8F98, borders #ECE3D3. Fonts: "DM Serif Display" for headings (big titles in italic),
  "DM Sans" for text. Rounded corners (12 / 20 / 28px), soft shadows, full-width dark primary
  buttons, tap targets of at least 44px, gentle 150–250ms animations, dark mode support.
- Only implement what each prompt asks, never break existing features, and the app must always run
  with `npm run dev` without console errors.