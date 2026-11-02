export const READING_PERSONALITIES = [
  {
    id: 'cozy',
    name: 'The Cozy Escapist',
    moodBias: ['calm', 'happy', 'nostalgic'],
    genres: ['Romance', 'Contemporary', 'Humor', 'Historical'],
    blurb: 'Warm, comforting stories that settle your mind and leave you smiling.',
  },
  {
    id: 'twist',
    name: 'The Twist Hunter',
    moodBias: ['scared', 'restless', 'angry'],
    genres: ['Mystery/Thriller', 'Sci-Fi', 'Horror'],
    blurb: 'You chase the hidden clue, the sharp reveal, and the last-page jolt.',
  },
  {
    id: 'dreamer',
    name: 'The Dream Wanderer',
    moodBias: ['giddy', 'happy'],
    genres: ['Fantasy', 'Young Adult', 'Sci-Fi'],
    blurb: 'You love a world to disappear into and a little wonder in the air.',
  },
  {
    id: 'soulful',
    name: 'The Heart Reader',
    moodBias: ['sad', 'nostalgic'],
    genres: ['Historical', 'Romance', 'Poetry', 'Classics'],
    blurb: 'You look for emotional depth, beautifully shaped language, and a lingering ache.',
  },
  {
    id: 'curious',
    name: 'The Curious Mind',
    moodBias: ['restless', 'calm'],
    genres: ['Non-fiction', 'Self-help', 'Mystery/Thriller'],
    blurb: 'You want ideas, insight, and a reason to think twice after the final page.',
  },
  {
    id: 'adventurer',
    name: 'The Plot Adventurer',
    moodBias: ['happy', 'giddy', 'restless'],
    genres: ['Fantasy', 'Historical', 'Young Adult', 'Adventure'],
    blurb: 'You like momentum, movement, and a journey worth taking with you.',
  },
];

export function getReadingPersonality(profile = {}) {
  const favoriteGenres = Array.isArray(profile.favoriteGenres) ? profile.favoriteGenres : [];
  const mood = profile.mood || 'calm';

  const byGenre = READING_PERSONALITIES.find((personality) =>
    favoriteGenres.some((genre) => personality.genres.includes(genre)),
  );

  const byMood = READING_PERSONALITIES.find((personality) =>
    personality.moodBias.includes(mood),
  );

  return (byGenre || byMood || READING_PERSONALITIES[0]).name;
}
