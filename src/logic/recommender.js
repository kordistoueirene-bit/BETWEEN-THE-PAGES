import { BOOKS } from '../data/index.js';
import { MOODS } from '../data/taxonomy.js';

const textValue = (value) => {
  if (value && typeof value === 'object') {
    return value.id ?? value.value ?? value.label ?? value.title ?? '';
  }
  return value ?? '';
};

const normalizeText = (value) =>
  String(textValue(value))
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const includesPhrase = (text, phrase) => {
  const normalizedText = ` ${normalizeText(text)} `;
  const normalizedPhrase = ` ${normalizeText(phrase)} `;
  return normalizedPhrase.trim().length > 0 && normalizedText.includes(normalizedPhrase);
};

const asArray = (value) => {
  if (value == null || value === '') return [];
  return Array.isArray(value) ? value : [value];
};

const unique = (values) => [...new Set(values)];

const hasPreference = (value) => {
  if (value === undefined || value === null || value === '') return false;
  if (typeof value === 'boolean') return value;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string' && ['any', 'all', 'none'].includes(normalizeText(value))) {
    return false;
  }
  return true;
};

const findBook = (reference) => {
  if (!reference) return null;
  if (typeof reference === 'object' && reference.id) {
    return BOOKS.find((book) => book.id === reference.id) ?? reference;
  }

  const normalizedReference = normalizeText(reference);
  return (
    BOOKS.find(
      (book) =>
        book.id === reference ||
        normalizeText(book.title) === normalizedReference,
    ) ?? null
  );
};

const profileValues = (profile, keys) =>
  unique(keys.flatMap((key) => asArray(profile?.[key])).map(textValue).filter(Boolean));

const favoriteGenres = (profile) =>
  profileValues(profile, ['favoriteGenres', 'favouriteGenres', 'genres']);

const preferredLanguages = (profile) =>
  profileValues(profile, ['preferredLanguages', 'languages', 'readingLanguage']);

const preferredFormats = (profile) =>
  profileValues(profile, ['preferredFormats', 'formats', 'readingFormat']);

const lovedBooks = (profile) =>
  unique(
    [
      ...profileValues(profile, [
        'booksLoved',
        'lovedBooks',
        'lovedBookIds',
        'favoriteBooks',
        'favoriteBookIds',
      ]),
    ].map(findBook).filter(Boolean),
  );

const valuesMatch = (left, right) => normalizeText(left) === normalizeText(right);

const hasSharedValue = (leftValues, rightValues) =>
  leftValues.some((left) => rightValues.some((right) => valuesMatch(left, right)));

const getAvoidedWarnings = (profile, filters) =>
  unique(
    [
      ...asArray(filters?.contentWarnings),
      ...asArray(filters?.contentWarningsToAvoid),
      ...asArray(filters?.avoidContent),
      ...asArray(filters?.contentToAvoid),
      ...asArray(profile?.contentWarningsToAvoid),
      ...asArray(profile?.thingsToAvoid),
      ...asArray(profile?.neverWant),
    ].map(textValue),
  );

const isInBookList = (list, book) =>
  asArray(list).some((entry) => {
    if (entry && typeof entry === 'object') return entry.id === book.id;
    return entry === book.id;
  });

const getExcludedGenres = (filters, freeTextPrefs, profile) =>
  unique(
    [
      ...asArray(profile?.excludedGenres),
      ...asArray(filters?.excludedGenres),
      ...asArray(filters?.excludeGenres),
      ...asArray(freeTextPrefs?.excludeGenres),
    ].map(textValue),
  );

const isExcluded = (book, context) => {
  const filters = context.filters ?? {};
  const library = context.library ?? {};
  const avoidedWarnings = getAvoidedWarnings(context.profile, filters);
  const excludedGenres = getExcludedGenres(
    filters,
    context.freeTextPrefs?.prefs ?? context.freeTextPrefs,
    context.profile,
  );
  const maxPages = Number(filters.maxPages);
  const includeRead = context.includeRead ?? filters.includeRead ?? false;

  if (avoidedWarnings.some((warning) => book.contentWarnings.some((item) => valuesMatch(item, warning)))) {
    return true;
  }
  if (excludedGenres.some((genre) => book.genres.some((item) => valuesMatch(item, genre)))) {
    return true;
  }
  if (Number.isFinite(maxPages) && maxPages > 0 && book.pages > maxPages) return true;
  if (filters.standalone && book.series) return true;
  if (filters.hiddenGemsOnly && book.ratingsCount >= 50000) return true;
  if (filters.awardWinners && !book.timely.award) return true;
  if (filters.hasAdaptation && !book.timely.adaptation) return true;
  if (filters.trending && book.timely.trendingScore < 75) return true;
  if (isInBookList(library.notForMe, book)) return true;
  if (!includeRead && isInBookList(library.read, book)) return true;
  return false;
};

const profileAffinity = (book, profile) => {
  if (!profile) return { points: 0, reasons: [] };

  let points = 0;
  const reasons = [];
  const genres = favoriteGenres(profile);
  const matchingGenres = genres.filter((genre) => book.genres.some((item) => valuesMatch(item, genre)));

  if (genres.length && matchingGenres.length) {
    points += (8 * matchingGenres.length) / Math.max(1, Math.min(genres.length, 3));
    reasons.push(`Matches your favorite genres: ${matchingGenres.slice(0, 2).join(', ')}`);
  }

  const languages = preferredLanguages(profile);
  const matchingLanguage = languages.find((language) =>
    book.languages.some((item) => valuesMatch(item, language)),
  );
  if (matchingLanguage) {
    points += 2.5;
    reasons.push(`Available in ${matchingLanguage}`);
  }

  const formats = preferredFormats(profile);
  const matchingFormat = formats.find((format) =>
    book.formats.some((item) => valuesMatch(item, format)),
  );
  if (matchingFormat) {
    points += 2.5;
    reasons.push(`Available as ${matchingFormat}`);
  }

  const loved = lovedBooks(profile);
  const sharesLovedTaste = loved.some(
    (lovedBook) =>
      hasSharedValue(book.genres, lovedBook.genres) || hasSharedValue(book.tropes, lovedBook.tropes),
  );
  if (sharesLovedTaste) {
    points += 2;
    reasons.push('Shares themes with books you loved');
  }

  return { points: Math.min(15, points), reasons };
};

const getFilterEntries = (filters) => {
  const currentYear = new Date().getFullYear();
  const getEra = (book) =>
    book.year < 1950 ? 'classic' : book.year >= currentYear - 2 ? 'brand new' : 'modern';
  const entries = [
    ['pace', filters.pace, (book) => book.pace],
    ['ending', filters.ending, (book) => book.ending],
    ['pov', filters.pov, (book) => book.pov],
    ['setting', filters.setting, (book) => book.setting],
    ['period', filters.period, (book) => book.period],
    ['style', filters.style, (book) => book.style],
    ['tropes', filters.tropes, (book) => book.tropes],
    ['languages', filters.languages, (book) => book.languages],
    ['formats', filters.formats, (book) => book.formats],
    ['era', filters.era, getEra],
    ['series', filters.series, (book) => book.series],
  ].filter(([, desired]) => hasPreference(desired));

  if (!hasPreference(filters.series) && hasPreference(filters.standalone)) {
    entries.push(['standalone', filters.standalone, (book) => !book.series]);
  }

  return entries;
};

const preferenceMatches = (book, desired, getActual) => {
  const expected = asArray(desired);
  const actual = getActual(book);
  const matchedCount = expected.filter((item) =>
    Array.isArray(actual)
      ? actual.some((value) => valuesMatch(value, item))
      : valuesMatch(actual, item),
  ).length;

  return expected.length ? matchedCount / expected.length : 0;
};

const scoreSpecificFilters = (book, filters) => {
  const entries = getFilterEntries(filters);
  if (!entries.length) return { points: 0, reasons: [] };

  const matchRatios = entries.map(([, desired, getActual]) =>
    preferenceMatches(book, desired, getActual),
  );
  const points = (20 * matchRatios.reduce((sum, ratio) => sum + ratio, 0)) / entries.length;
  const reasons = [];

  entries.forEach(([key, desired], index) => {
    if (matchRatios[index] === 0) return;
    const value = asArray(desired).map(textValue).join(', ');
    const reasonByKey = {
      pace: value === 'page-turner' ? 'A page-turner' : `${value} pace`,
      ending: `Has a ${value} ending`,
      pov: `Told in ${value}`,
      setting: `Set in ${value}`,
      period: `Set in the ${value}`,
      style: `Written in a ${value} style`,
      tropes: `Includes ${value}`,
      languages: `Available in ${value}`,
      formats: `Available as ${value}`,
      era: `A ${value} read`,
      series: desired ? 'Part of a series' : 'A standalone book',
      standalone: desired ? 'A standalone book' : 'Part of a series',
    };
    reasons.push(reasonByKey[key]);
  });

  return { points, reasons };
};

const getFreeTextPrefs = (freeTextPrefs) => {
  if (typeof freeTextPrefs === 'string') return parseFreeText(freeTextPrefs).prefs;
  return freeTextPrefs?.prefs ?? freeTextPrefs ?? {};
};

const scoreFreeText = (book, freeTextPrefs) => {
  const prefs = getFreeTextPrefs(freeTextPrefs);
  const criteria = [];
  const addCriterion = (matches) => criteria.push(Boolean(matches));

  if (prefs.length) addCriterion(book.length === prefs.length);
  if (prefs.ending) addCriterion(valuesMatch(book.ending, prefs.ending));
  if (prefs.gives?.length) {
    addCriterion(prefs.gives.some((give) => book.gives.some((item) => valuesMatch(item, give))));
  }
  if (prefs.setting) addCriterion(valuesMatch(book.setting, prefs.setting));
  if (prefs.pace) addCriterion(valuesMatch(book.pace, prefs.pace));
  if (prefs.comfort) addCriterion(book.gives.includes('comfort me'));
  if (prefs.newRelease) addCriterion(book.timely.isNewRelease);
  if (prefs.classic) addCriterion(book.year < 1950);

  const tags = asArray(prefs.matchedTags ?? prefs.tags);
  if (tags.length) {
    addCriterion(tags.some((tag) => book.tags.some((item) => valuesMatch(item, tag))));
  }

  const titles = asArray(prefs.matchedTitles);
  if (titles.length && !prefs.similarTo) {
    addCriterion(titles.includes(book.id));
  }

  if (prefs.similarTo) {
    const sourceBook = findBook(prefs.similarTo);
    addCriterion(
      sourceBook &&
        book.id !== sourceBook.id &&
        (hasSharedValue(book.genres, sourceBook.genres) || hasSharedValue(book.tropes, sourceBook.tropes)),
    );
  }

  if (!criteria.length) return { points: 0, reasons: [] };

  const matched = criteria.filter(Boolean).length;
  const reasons = [];
  const keywords = asArray(prefs.matchedTags ?? prefs.tags).slice(0, 3);
  if (matched && keywords.length) reasons.push(`Matches your search: ${keywords.join(', ')}`);
  if (prefs.similarTo && matched) {
    const sourceBook = findBook(prefs.similarTo);
    if (sourceBook) reasons.push(`Similar to ${sourceBook.title}`);
  }
  if (prefs.classic && book.year < 1950) reasons.push('A classic published before 1950');

  return { points: (10 * matched) / criteria.length, reasons };
};

const scoreTimely = (book) => {
  const timely = book.timely;
  const month = new Date().getMonth();
  const currentSeason = month >= 2 && month <= 4 ? 'spring' :
    month >= 5 && month <= 7 ? 'summer' :
      month >= 8 && month <= 10 ? 'autumn' : 'winter';
  let points = Math.min(2, (timely.trendingScore / 100) * 2);
  const reasons = [];

  if (timely.trendingScore >= 75) reasons.push('Trending this week');
  if (timely.isNewRelease) {
    points += 1;
    reasons.push('A recent release');
  }
  if (timely.adaptation) {
    points += 1;
    reasons.push(
      timely.adaptation.when === 'Coming soon' ? 'Coming to the screen soon' : 'Has a screen adaptation',
    );
  }
  if (timely.seasonal === currentSeason && ['autumn', 'winter'].includes(currentSeason)) {
    points += 1;
    reasons.push(`A ${currentSeason} pick`);
  }

  return { points: Math.min(5, points), reasons };
};

const scoreFeedback = (book, library) => {
  const ratings = library?.ratings ?? {};
  let likedSimilarGenres = false;
  let dislikedSimilarGenres = false;
  const reasons = [];

  Object.entries(ratings).forEach(([bookId, ratingValue]) => {
    const ratedBook = findBook(bookId);
    const stars = Number(ratingValue?.stars ?? ratingValue);
    if (!ratedBook || !Number.isFinite(stars) || !hasSharedValue(book.genres, ratedBook.genres)) return;

    if (stars >= 4 && stars <= 5) likedSimilarGenres = true;
    if (stars >= 1 && stars <= 2) dislikedSimilarGenres = true;
  });

  if (likedSimilarGenres) reasons.push('Similar to books you rated highly');
  if (dislikedSimilarGenres) reasons.push('Less like books you rated poorly');

  return {
    points: (likedSimilarGenres ? 5 : 0) - (dislikedSimilarGenres ? 5 : 0),
    reasons,
  };
};

const moodLabel = (mood) => {
  const value = textValue(mood);
  return MOODS.find((item) => valuesMatch(item.id, value) || valuesMatch(item.label, value))?.label ?? value;
};

export function parseFreeText(text = '') {
  const normalized = normalizeText(text);
  const prefs = {
    length: null,
    ending: null,
    gives: [],
    setting: null,
    pace: null,
    comfort: false,
    newRelease: false,
    classic: false,
    excludeGenres: [],
    spoilers: 'hidden',
    similarTo: null,
    matchedTags: [],
    matchedTitles: [],
  };
  const matchedKeywords = [];
  const record = (keyword) => matchedKeywords.push(keyword);

  if (['short', 'quick'].some((term) => includesPhrase(normalized, term))) {
    prefs.length = 'short';
    record('short');
  }
  if (['long', 'epic'].some((term) => includesPhrase(normalized, term))) {
    prefs.length = 'long';
    record('long');
  }
  if (includesPhrase(normalized, 'happy ending')) {
    prefs.ending = 'happy';
    record('happy ending');
  } else if (includesPhrase(normalized, 'twist')) {
    prefs.ending = 'twist';
    record('twist');
  }
  if (['funny', 'laugh'].some((term) => includesPhrase(normalized, term))) {
    prefs.gives.push('make me laugh');
    record('funny');
  }
  if (['sad', 'cry'].some((term) => includesPhrase(normalized, term))) {
    prefs.gives.push('make me cry');
    record('sad');
  }
  if (['greece', 'greek'].some((term) => includesPhrase(normalized, term))) {
    prefs.setting = 'Greece';
    record('Greece');
  }
  if (includesPhrase(normalized, 'no romance')) {
    prefs.excludeGenres.push('Romance');
    record('no romance');
  }
  if (
    includesPhrase(normalized, 'spoiler') ||
    includesPhrase(normalized, 'spoilers') ||
    includesPhrase(normalized, 'how it ends')
  ) {
    prefs.spoilers = 'show';
    record('spoilers');
  }
  if (includesPhrase(normalized, 'page turner')) {
    prefs.pace = 'page-turner';
    record('page-turner');
  } else if (includesPhrase(normalized, 'slow')) {
    prefs.pace = 'slow-burn';
    record('slow');
  }
  if (includesPhrase(normalized, 'cozy') || includesPhrase(normalized, 'cosy')) {
    prefs.comfort = true;
    prefs.gives.push('comfort me');
    record('cozy');
  }
  if (['new', 'recent'].some((term) => includesPhrase(normalized, term))) {
    prefs.newRelease = true;
    record('new release');
  }
  if (['classic', 'classics'].some((term) => includesPhrase(normalized, term))) {
    prefs.classic = true;
    record('classic');
  }

  const matchedTitles = BOOKS.filter((book) => includesPhrase(normalized, book.title));
  prefs.matchedTitles = matchedTitles.map((book) => book.id);
  const mentionsLike = includesPhrase(normalized, 'like');
  if (mentionsLike && matchedTitles.length) {
    prefs.similarTo = matchedTitles[0].id;
    record(`like ${matchedTitles[0].title}`);
  }

  const allTags = unique(BOOKS.flatMap((book) => book.tags));
  prefs.matchedTags = allTags.filter((tag) => includesPhrase(normalized, tag));
  prefs.matchedTags.forEach(record);

  const titleTokens = unique(
    BOOKS.flatMap((book) => normalizeText(book.title).split(' ').filter((word) => word.length >= 5)),
  );
  titleTokens.forEach((token) => {
    if (includesPhrase(normalized, token)) record(token);
  });

  prefs.gives = unique(prefs.gives);
  prefs.excludeGenres = unique(prefs.excludeGenres);
  return { prefs, matchedKeywords: unique(matchedKeywords) };
}

export function scoreBook(book, context = {}) {
  if (!book || isExcluded(book, context)) return null;

  let score = 0;
  const reasons = [];
  const mood = textValue(context.mood);
  const gives = asArray(context.gives).map(textValue).filter(Boolean);
  const length = textValue(context.length);

  if (mood && book.moods.some((item) => valuesMatch(item, mood))) {
    score += 20;
    reasons.push(`Matches your mood: ${moodLabel(context.mood)}`);
  }
  const matchingGives = gives.filter((give) => book.gives.some((item) => valuesMatch(item, give)));
  if (matchingGives.length) {
    score += 20;
    reasons.push(`Matches what you want: ${matchingGives.join(', ')}`);
  }
  if (length && valuesMatch(book.length, length)) {
    score += 10;
    const lengthLabel = book.length[0].toUpperCase() + book.length.slice(1);
    reasons.push(`${lengthLabel} read (${book.pages} pages)`);
  }

  const affinity = profileAffinity(book, context.profile);
  score += affinity.points;
  reasons.push(...affinity.reasons);

  const filters = scoreSpecificFilters(book, context.filters ?? {});
  score += filters.points;
  reasons.push(...filters.reasons);

  const freeText = scoreFreeText(book, context.freeTextPrefs);
  score += freeText.points;
  reasons.push(...freeText.reasons);

  const timely = scoreTimely(book);
  score += timely.points;
  reasons.push(...timely.reasons);

  const feedback = scoreFeedback(book, context.library);
  score += feedback.points;
  reasons.push(...feedback.reasons);

  if (!reasons.length && book.rating >= 4.3) reasons.push('Popular with readers');

  return {
    book,
    score: Math.max(0, Math.min(100, Math.round(score))),
    reasons: unique(reasons).slice(0, 6),
  };
}

const isLighterOption = (book) =>
  ['Humor', 'Romance', 'Young Adult', 'Fantasy'].some((genre) => book.genres.includes(genre)) ||
  ['happy', 'bittersweet'].includes(book.ending) ||
  ['make me happy', 'make me laugh', 'comfort me'].some((give) => book.gives.includes(give));

const sortByScore = (left, right) =>
  right.score - left.score || left.book.id.localeCompare(right.book.id);

export function recommend(context = {}) {
  const scoredBooks = BOOKS.map((book) => scoreBook(book, context))
    .filter(Boolean)
    .sort(sortByScore);
  const top = scoredBooks[0];

  if (!top) return { mainPick: null, alternatives: [] };

  const shownIds = new Set([top.book.id]);
  const alternatives = [];
  const angles = [
    ['Lighter option', (book) => isLighterOption(book)],
    ['Shorter option', (book) => book.pages < top.book.pages],
    ['A classic pick', (book) => book.year < 1950],
    ['Trending now', (book) => book.timely.trendingScore >= 75],
  ];

  angles.forEach(([label, matchesAngle]) => {
    const candidate = scoredBooks.find(
      (entry) => !shownIds.has(entry.book.id) && matchesAngle(entry.book),
    );
    if (!candidate) return;

    shownIds.add(candidate.book.id);
    alternatives.push({
      ...candidate,
      label,
      matchPercent: candidate.score,
    });
  });

  return {
    mainPick: { ...top, matchPercent: top.score },
    alternatives,
  };
}

const profileSortScore = (book, profile) => {
  const affinity = profileAffinity(book, profile).points;
  return book.rating * 2 + Math.log10(book.ratingsCount + 1) + affinity * 0.15;
};

const sortPersonalized = (books, profile, score) =>
  [...books].sort(
    (left, right) =>
      score(right, profile) - score(left, profile) || left.id.localeCompare(right.id),
  );

const currentSeason = () => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
};

export function getTimelyCollections(profile = null) {
  const seasonalName = currentSeason();
  const personalized = (books) => sortPersonalized(books, profile, profileSortScore);

  return {
    trending: personalized(BOOKS.filter((book) => book.timely.trendingScore >= 75)).sort(
      (left, right) =>
        right.timely.trendingScore - left.timely.trendingScore ||
        profileSortScore(right, profile) - profileSortScore(left, profile),
    ),
    newReleases: personalized(BOOKS.filter((book) => book.timely.isNewRelease)),
    comingToScreen: personalized(
      BOOKS.filter((book) => book.timely.adaptation?.when === 'Coming soon'),
    ),
    seasonal: personalized(BOOKS.filter((book) => book.timely.seasonal === seasonalName)),
  };
}

const popularScore = (book) => book.rating * 2 + Math.log10(book.ratingsCount + 1);

const ageRangeGenres = (ageRange) => {
  const normalized = normalizeText(ageRange);
  if (!normalized) return [];
  if (/under 18|13 17|14 17|teen/.test(normalized)) return ['Young Adult', 'Fantasy', 'Graphic novel'];
  if (/18 24|18 25|18 29/.test(normalized)) return ['Contemporary', 'Romance', 'Fantasy', 'Sci-Fi'];
  if (/25 34|25 35|30 39/.test(normalized)) return ['Contemporary', 'Mystery/Thriller', 'Sci-Fi'];
  if (/35 44|35 45|40 49/.test(normalized)) return ['Contemporary', 'Historical', 'Mystery/Thriller'];
  if (/45 54|45 55|50 59/.test(normalized)) return ['Classics', 'Historical', 'Non-fiction'];
  if (/55|65|older|over/.test(normalized)) return ['Classics', 'Historical', 'Non-fiction'];
  return [];
};

const popularForProfileScore = (book, profile) => {
  const favoriteGenreMatches = favoriteGenres(profile).filter((genre) => book.genres.includes(genre)).length;
  const ageGenreMatches = ageRangeGenres(profile?.ageRange ?? profile?.age).filter((genre) =>
    book.genres.includes(genre),
  ).length;
  return popularScore(book) + favoriteGenreMatches * 2 + ageGenreMatches * 0.75;
};

export function getHomeRecommendations(profile = null, library = {}) {
  const availableBooks = BOOKS.filter((book) => !isExcluded(book, { profile, library }));
  const generallyPopular = [...availableBooks]
    .sort((left, right) => popularScore(right) - popularScore(left) || left.id.localeCompare(right.id));

  if (!profile) {
    return {
      pickedForYou: generallyPopular.slice(0, 5),
      becauseYouLoved: [],
      popularWithReadersLikeYou: generallyPopular.slice(0, 5),
    };
  }

  const ranked = availableBooks.map((book) => scoreBook(book, { profile, library }))
    .filter(Boolean)
    .sort(sortByScore);
  const lovedSections = lovedBooks(profile).map((lovedBook) => ({
    title: `Because you loved ${lovedBook.title}`,
    sourceBook: lovedBook,
    books: sortPersonalized(
      availableBooks.filter(
        (book) =>
          book.id !== lovedBook.id &&
          (hasSharedValue(book.genres, lovedBook.genres) || hasSharedValue(book.tropes, lovedBook.tropes)),
      ),
      profile,
      (book) => profileSortScore(book, profile) +
        (hasSharedValue(book.genres, lovedBook.genres) ? 2 : 0) +
        (hasSharedValue(book.tropes, lovedBook.tropes) ? 1 : 0),
    ).slice(0, 4),
  }));

  return {
    pickedForYou: ranked.slice(0, 5).map((entry) => entry.book),
    becauseYouLoved: lovedSections,
    popularWithReadersLikeYou: sortPersonalized(availableBooks, profile, popularForProfileScore).slice(0, 5),
  };
}

export function estimateReadingTime(pages, minutesPerDay) {
  const totalPages = Number(pages);
  const dailyMinutes = Number(minutesPerDay);
  if (!Number.isFinite(totalPages) || totalPages <= 0 || !Number.isFinite(dailyMinutes) || dailyMinutes <= 0) {
    return 'Reading time unavailable';
  }

  const pagesPerDay = dailyMinutes * (40 / 60);
  const days = Math.max(1, Math.ceil(totalPages / pagesPerDay));
  return `about ${days} ${days === 1 ? 'day' : 'days'} at ${dailyMinutes} min/day`;
}