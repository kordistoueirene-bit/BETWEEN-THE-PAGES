export const QUIZ_QUESTIONS = [
  {
    id: 'q-1',
    prompt: 'Rainy café or sunny beach?',
    options: [
      {
        label: 'Rainy café',
        weights: {
          genres: { Contemporary: 2, Romance: 1 },
          moods: { calm: 2, nostalgic: 1 },
          gives: { 'make me think': 1 },
          pace: { 'slow-burn': 2 },
          ending: { bittersweet: 1 },
          length: { medium: 1 },
          style: { lyrical: 1 },
        },
      },
      {
        label: 'Sunny beach',
        weights: {
          genres: { Fantasy: 1, Contemporary: 1 },
          moods: { giddy: 2, happy: 1 },
          gives: { 'escape from everyday life': 2 },
          pace: { 'page-turner': 1 },
          ending: { happy: 2 },
          length: { short: 1 },
          style: { witty: 1 },
        },
      },
    ],
  },
  {
    id: 'q-2',
    prompt: 'Plot twist or happy ending?',
    options: [
      {
        label: 'Plot twist',
        weights: {
          genres: { 'Mystery/Thriller': 3, Horror: 1 },
          moods: { restless: 2, scared: 1 },
          gives: { 'thrill me': 2 },
          pace: { 'page-turner': 2 },
          ending: { twist: 3 },
          length: { short: 1 },
          style: { dark: 1 },
        },
      },
      {
        label: 'Happy ending',
        weights: {
          genres: { Romance: 2, Historical: 1 },
          moods: { happy: 2, calm: 1 },
          gives: { 'make me happy': 2 },
          pace: { steady: 1 },
          ending: { happy: 3 },
          length: { medium: 1 },
          style: { witty: 1 },
        },
      },
    ],
  },
  {
    id: 'q-3',
    prompt: 'Dragons or detectives?',
    options: [
      {
        label: 'Dragons',
        weights: {
          genres: { Fantasy: 3, 'Young Adult': 1 },
          moods: { giddy: 2, happy: 1 },
          gives: { 'escape from everyday life': 2 },
          pace: { 'page-turner': 1 },
          ending: { happy: 1 },
          length: { medium: 1 },
          style: { poetic: 1 },
        },
      },
      {
        label: 'Detectives',
        weights: {
          genres: { 'Mystery/Thriller': 3, Horror: 1 },
          moods: { scared: 2, restless: 1 },
          gives: { 'thrill me': 2 },
          pace: { 'page-turner': 2 },
          ending: { twist: 2 },
          length: { short: 1 },
          style: { dark: 1 },
        },
      },
    ],
  },
  {
    id: 'q-4',
    prompt: 'Short and sharp or long and deep?',
    options: [
      {
        label: 'Short and sharp',
        weights: {
          genres: { Humor: 2, Contemporary: 1 },
          moods: { happy: 2 },
          gives: { 'make me laugh': 2 },
          pace: { 'page-turner': 1 },
          length: { short: 3 },
          style: { witty: 1 },
        },
      },
      {
        label: 'Long and deep',
        weights: {
          genres: { Classics: 2, Historical: 1 },
          moods: { nostalgic: 2 },
          gives: { 'make me think': 2 },
          pace: { 'slow-burn': 2 },
          ending: { bittersweet: 1 },
          length: { long: 3 },
          style: { lyrical: 1 },
        },
      },
    ],
  },
  {
    id: 'q-5',
    prompt: 'Laugh or cry?',
    options: [
      {
        label: 'Laugh',
        weights: {
          genres: { Humor: 3, Romance: 1 },
          moods: { happy: 3 },
          gives: { 'make me laugh': 3 },
          pace: { steady: 1 },
          ending: { happy: 2 },
          length: { medium: 1 },
          style: { witty: 2 },
        },
      },
      {
        label: 'Cry',
        weights: {
          genres: { Romance: 2, Poetry: 1 },
          moods: { sad: 3, nostalgic: 1 },
          gives: { 'make me cry': 3 },
          pace: { 'slow-burn': 1 },
          ending: { bittersweet: 2 },
          length: { long: 1 },
          style: { poetic: 2 },
        },
      },
    ],
  },
  {
    id: 'q-6',
    prompt: 'A cozy village or a dangerous city?',
    options: [
      {
        label: 'Cozy village',
        weights: {
          genres: { Contemporary: 2, Historical: 1 },
          moods: { calm: 2 },
          gives: { 'comfort me': 2 },
          pace: { steady: 1 },
          ending: { happy: 2 },
          length: { medium: 1 },
          style: { 'simple & easy': 1 },
        },
      },
      {
        label: 'Dangerous city',
        weights: {
          genres: { 'Mystery/Thriller': 2, Horror: 1 },
          moods: { restless: 2 },
          gives: { 'thrill me': 2 },
          pace: { 'page-turner': 2 },
          ending: { twist: 1 },
          length: { short: 1 },
          style: { dark: 2 },
        },
      },
    ],
  },
  {
    id: 'q-7',
    prompt: 'History or future?',
    options: [
      {
        label: 'History',
        weights: {
          genres: { Historical: 3, Classics: 1 },
          moods: { nostalgic: 2 },
          gives: { 'make me think': 1 },
          pace: { 'slow-burn': 1 },
          ending: { bittersweet: 1 },
          length: { long: 2 },
          style: { lyrical: 1 },
        },
      },
      {
        label: 'Future',
        weights: {
          genres: { 'Sci-Fi': 3, Fantasy: 1 },
          moods: { giddy: 1, scared: 1 },
          gives: { 'escape from everyday life': 2 },
          pace: { 'page-turner': 2 },
          ending: { open: 1 },
          length: { medium: 1 },
          style: { dark: 1 },
        },
      },
    ],
  },
  {
    id: 'q-8',
    prompt: 'Classic literature or modern bestseller?',
    options: [
      {
        label: 'Classic literature',
        weights: {
          genres: { Classics: 3, Poetry: 1 },
          moods: { nostalgic: 2 },
          gives: { 'make me think': 2 },
          pace: { 'slow-burn': 2 },
          ending: { bittersweet: 1 },
          length: { long: 2 },
          style: { poetic: 1 },
        },
      },
      {
        label: 'Modern bestseller',
        weights: {
          genres: { Contemporary: 3, Romance: 1 },
          moods: { happy: 1, giddy: 1 },
          gives: { 'escape from everyday life': 2 },
          pace: { 'page-turner': 2 },
          ending: { happy: 2 },
          length: { medium: 1 },
          style: { witty: 1 },
        },
      },
    ],
  },
  {
    id: 'q-9',
    prompt: 'A quest or a secret?',
    options: [
      {
        label: 'A quest',
        weights: {
          genres: { Fantasy: 3, 'Young Adult': 1 },
          moods: { happy: 2 },
          gives: { 'escape from everyday life': 2 },
          pace: { steady: 1 },
          ending: { happy: 1 },
          length: { long: 1 },
          style: { poetic: 1 },
        },
      },
      {
        label: 'A secret',
        weights: {
          genres: { 'Mystery/Thriller': 3, Horror: 1 },
          moods: { restless: 2, scared: 1 },
          gives: { 'thrill me': 2 },
          pace: { 'page-turner': 2 },
          ending: { twist: 2 },
          length: { medium: 1 },
          style: { dark: 2 },
        },
      },
    ],
  },
  {
    id: 'q-10',
    prompt: 'Make me laugh or make me cry?',
    options: [
      {
        label: 'Laugh',
        weights: {
          genres: { Humor: 3, Romance: 1 },
          moods: { happy: 3 },
          gives: { 'make me laugh': 3 },
          pace: { steady: 1 },
          ending: { happy: 2 },
          length: { short: 1 },
          style: { witty: 2 },
        },
      },
      {
        label: 'Cry',
        weights: {
          genres: { Romance: 2, Poetry: 1 },
          moods: { sad: 2, nostalgic: 1 },
          gives: { 'make me cry': 3 },
          pace: { 'slow-burn': 1 },
          ending: { bittersweet: 2 },
          length: { long: 1 },
          style: { lyrical: 2 },
        },
      },
    ],
  },
  {
    id: 'q-11',
    prompt: 'A romance with tension or a friendship story?',
    options: [
      {
        label: 'Romance with tension',
        weights: {
          genres: { Romance: 3, Contemporary: 1 },
          moods: { giddy: 2 },
          gives: { 'make me happy': 1 },
          pace: { 'page-turner': 1 },
          ending: { happy: 2 },
          length: { medium: 1 },
          style: { witty: 1 },
        },
      },
      {
        label: 'Friendship story',
        weights: {
          genres: { Contemporary: 2, Historical: 1 },
          moods: { calm: 2 },
          gives: { 'comfort me': 2 },
          pace: { steady: 1 },
          ending: { bittersweet: 1 },
          length: { medium: 1 },
          style: { 'simple & easy': 1 },
        },
      },
    ],
  },
  {
    id: 'q-12',
    prompt: 'Campfire ghost story or star-filled fantasy?',
    options: [
      {
        label: 'Campfire ghost story',
        weights: {
          genres: { Horror: 3, 'Mystery/Thriller': 1 },
          moods: { scared: 3 },
          gives: { 'thrill me': 2 },
          pace: { 'page-turner': 1 },
          ending: { twist: 1 },
          length: { short: 1 },
          style: { dark: 2 },
        },
      },
      {
        label: 'Star-filled fantasy',
        weights: {
          genres: { Fantasy: 3, 'Sci-Fi': 1 },
          moods: { happy: 2 },
          gives: { 'escape from everyday life': 2 },
          pace: { steady: 1 },
          ending: { happy: 2 },
          length: { long: 1 },
          style: { poetic: 1 },
        },
      },
    ],
  },
  {
    id: 'q-13',
    prompt: 'Low stakes and cozy or high stakes and deadly?',
    options: [
      {
        label: 'Low stakes and cozy',
        weights: {
          genres: { Contemporary: 2, Humor: 1 },
          moods: { calm: 2 },
          gives: { 'comfort me': 2 },
          pace: { steady: 1 },
          ending: { happy: 2 },
          length: { medium: 1 },
          style: { 'simple & easy': 1 },
        },
      },
      {
        label: 'High stakes and deadly',
        weights: {
          genres: { 'Mystery/Thriller': 2, Horror: 2 },
          moods: { restless: 3 },
          gives: { 'thrill me': 2 },
          pace: { 'page-turner': 2 },
          ending: { twist: 1 },
          length: { medium: 1 },
          style: { dark: 2 },
        },
      },
    ],
  },
  {
    id: 'q-14',
    prompt: 'A book that teaches you something or one that lets you disappear into a world?',
    options: [
      {
        label: 'Teaches me something',
        weights: {
          genres: { 'Non-fiction': 2, 'Self-help': 1 },
          moods: { calm: 1 },
          gives: { 'teach me something': 3 },
          pace: { steady: 1 },
          ending: { open: 1 },
          length: { medium: 1 },
          style: { 'simple & easy': 1 },
        },
      },
      {
        label: 'Lets me disappear into a world',
        weights: {
          genres: { Fantasy: 2, Historical: 1 },
          moods: { giddy: 2 },
          gives: { 'escape from everyday life': 3 },
          pace: { 'page-turner': 1 },
          ending: { happy: 1 },
          length: { long: 1 },
          style: { lyrical: 1 },
        },
      },
    ],
  },
  {
    id: 'q-15',
    prompt: 'Poetry collection or novel?',
    options: [
      {
        label: 'Poetry collection',
        weights: {
          genres: { Poetry: 3, Classics: 1 },
          moods: { nostalgic: 2 },
          gives: { 'make me think': 2 },
          pace: { 'slow-burn': 1 },
          ending: { open: 1 },
          length: { short: 2 },
          style: { poetic: 3 },
        },
      },
      {
        label: 'Novel',
        weights: {
          genres: { Contemporary: 2, Romance: 1 },
          moods: { happy: 1 },
          gives: { 'make me happy': 2 },
          pace: { 'page-turner': 1 },
          ending: { happy: 1 },
          length: { medium: 2 },
          style: { lyrical: 1 },
        },
      },
    ],
  },
  {
    id: 'q-16',
    prompt: 'A slow-burn romance or instant chemistry?',
    options: [
      {
        label: 'Slow-burn romance',
        weights: {
          genres: { Romance: 3, Contemporary: 1 },
          moods: { calm: 1 },
          gives: { 'make me think': 1 },
          pace: { 'slow-burn': 3 },
          ending: { bittersweet: 1 },
          length: { medium: 1 },
          style: { lyrical: 1 },
        },
      },
      {
        label: 'Instant chemistry',
        weights: {
          genres: { Romance: 2, Humor: 1 },
          moods: { giddy: 2 },
          gives: { 'make me happy': 2 },
          pace: { 'page-turner': 1 },
          ending: { happy: 2 },
          length: { short: 1 },
          style: { witty: 1 },
        },
      },
    ],
  },
  {
    id: 'q-17',
    prompt: 'A witty narrator or a lyrical narrator?',
    options: [
      {
        label: 'Witty narrator',
        weights: {
          genres: { Humor: 2, Contemporary: 1 },
          moods: { happy: 1 },
          gives: { 'make me laugh': 2 },
          pace: { steady: 1 },
          ending: { happy: 1 },
          length: { medium: 1 },
          style: { witty: 3 },
        },
      },
      {
        label: 'Lyrical narrator',
        weights: {
          genres: { Classics: 2, Poetry: 1 },
          moods: { nostalgic: 2 },
          gives: { 'make me think': 2 },
          pace: { 'slow-burn': 1 },
          ending: { bittersweet: 1 },
          length: { long: 1 },
          style: { lyrical: 3 },
        },
      },
    ],
  },
  {
    id: 'q-18',
    prompt: 'A locked-room mystery or a road trip?',
    options: [
      {
        label: 'Locked-room mystery',
        weights: {
          genres: { 'Mystery/Thriller': 3, Horror: 1 },
          moods: { restless: 2 },
          gives: { 'thrill me': 2 },
          pace: { 'page-turner': 2 },
          ending: { twist: 2 },
          length: { medium: 1 },
          style: { dark: 1 },
        },
      },
      {
        label: 'Road trip',
        weights: {
          genres: { Contemporary: 2, Historical: 1 },
          moods: { happy: 1, giddy: 1 },
          gives: { 'escape from everyday life': 2 },
          pace: { steady: 1 },
          ending: { happy: 2 },
          length: { medium: 1 },
          style: { 'simple & easy': 1 },
        },
      },
    ],
  },
  {
    id: 'q-19',
    prompt: 'A book that leaves you uneasy or one that leaves you glowing?',
    options: [
      {
        label: 'Uneasy',
        weights: {
          genres: { Horror: 2, 'Mystery/Thriller': 2 },
          moods: { scared: 2 },
          gives: { 'thrill me': 2 },
          pace: { 'page-turner': 1 },
          ending: { twist: 2 },
          length: { medium: 1 },
          style: { dark: 2 },
        },
      },
      {
        label: 'Glowing',
        weights: {
          genres: { Romance: 2, Fantasy: 1 },
          moods: { happy: 2, giddy: 1 },
          gives: { 'make me happy': 2 },
          pace: { steady: 1 },
          ending: { happy: 3 },
          length: { medium: 1 },
          style: { witty: 1 },
        },
      },
    ],
  },
  {
    id: 'q-20',
    prompt: 'Found family or enemies to lovers?',
    options: [
      {
        label: 'Found family',
        weights: {
          genres: { Fantasy: 2, Contemporary: 1 },
          moods: { calm: 2 },
          gives: { 'comfort me': 2 },
          pace: { steady: 1 },
          ending: { happy: 2 },
          length: { medium: 1 },
          style: { 'simple & easy': 1 },
        },
      },
      {
        label: 'Enemies to lovers',
        weights: {
          genres: { Romance: 3, Contemporary: 1 },
          moods: { giddy: 2 },
          gives: { 'make me happy': 2 },
          pace: { 'page-turner': 1 },
          ending: { happy: 2 },
          length: { medium: 1 },
          style: { witty: 2 },
        },
      },
    ],
  },
  {
    id: 'q-21',
    prompt: 'Travel through time or travel through a real city?',
    options: [
      {
        label: 'Travel through time',
        weights: {
          genres: { 'Sci-Fi': 3, Historical: 1 },
          moods: { restless: 1 },
          gives: { 'escape from everyday life': 2 },
          pace: { 'page-turner': 1 },
          ending: { open: 1 },
          length: { medium: 1 },
          style: { poetic: 1 },
        },
      },
      {
        label: 'Travel through a real city',
        weights: {
          genres: { Contemporary: 2, Romance: 1 },
          moods: { calm: 1 },
          gives: { 'comfort me': 1 },
          pace: { steady: 1 },
          ending: { bittersweet: 1 },
          length: { medium: 1 },
          style: { 'simple & easy': 1 },
        },
      },
    ],
  },
  {
    id: 'q-22',
    prompt: 'The ocean or the mountains?',
    options: [
      {
        label: 'The ocean',
        weights: {
          genres: { Contemporary: 2, Romance: 1 },
          moods: { calm: 2 },
          gives: { 'comfort me': 2 },
          pace: { steady: 1 },
          ending: { happy: 1 },
          length: { medium: 1 },
          style: { lyrical: 1 },
        },
      },
      {
        label: 'The mountains',
        weights: {
          genres: { Fantasy: 2, Historical: 1 },
          moods: { happy: 1 },
          gives: { 'escape from everyday life': 2 },
          pace: { 'page-turner': 1 },
          ending: { open: 1 },
          length: { long: 1 },
          style: { poetic: 1 },
        },
      },
    ],
  },
  {
    id: 'q-23',
    prompt: 'Diary format or third-person narration?',
    options: [
      {
        label: 'Diary format',
        weights: {
          genres: { Contemporary: 2, Romance: 1 },
          moods: { calm: 1 },
          gives: { 'make me think': 1 },
          pace: { steady: 1 },
          ending: { bittersweet: 1 },
          length: { medium: 1 },
          style: { 'simple & easy': 2 },
        },
      },
      {
        label: 'Third-person narration',
        weights: {
          genres: { Historical: 2, Fantasy: 1 },
          moods: { nostalgic: 1 },
          gives: { 'escape from everyday life': 2 },
          pace: { 'slow-burn': 1 },
          ending: { happy: 1 },
          length: { long: 1 },
          style: { lyrical: 2 },
        },
      },
    ],
  },
  {
    id: 'q-24',
    prompt: 'Unreliable narrator or trustworthy guide?',
    options: [
      {
        label: 'Unreliable narrator',
        weights: {
          genres: { 'Mystery/Thriller': 3, Horror: 1 },
          moods: { restless: 2 },
          gives: { 'thrill me': 2 },
          pace: { 'page-turner': 1 },
          ending: { twist: 2 },
          length: { medium: 1 },
          style: { dark: 1 },
        },
      },
      {
        label: 'Trustworthy guide',
        weights: {
          genres: { Contemporary: 2, Romance: 1 },
          moods: { calm: 2 },
          gives: { 'comfort me': 2 },
          pace: { steady: 1 },
          ending: { happy: 2 },
          length: { medium: 1 },
          style: { 'simple & easy': 1 },
        },
      },
    ],
  },
  {
    id: 'q-25',
    prompt: 'A hidden gem or a bestseller everyone talks about?',
    options: [
      {
        label: 'A hidden gem',
        weights: {
          genres: { Classics: 1, Contemporary: 2 },
          moods: { restless: 1 },
          gives: { 'make me think': 2 },
          pace: { 'slow-burn': 1 },
          ending: { open: 1 },
          length: { long: 1 },
          style: { lyrical: 1 },
        },
      },
      {
        label: 'A bestseller everyone talks about',
        weights: {
          genres: { Romance: 2, Fantasy: 1 },
          moods: { happy: 2 },
          gives: { 'make me happy': 2 },
          pace: { 'page-turner': 2 },
          ending: { happy: 2 },
          length: { medium: 1 },
          style: { witty: 1 },
        },
      },
    ],
  },
  {
    id: 'q-26',
    prompt: 'A quiet literary read or a loud, chaotic one?',
    options: [
      {
        label: 'Quiet literary read',
        weights: {
          genres: { Classics: 2, Poetry: 1 },
          moods: { nostalgic: 2 },
          gives: { 'make me think': 2 },
          pace: { 'slow-burn': 2 },
          ending: { bittersweet: 1 },
          length: { long: 1 },
          style: { poetic: 2 },
        },
      },
      {
        label: 'Loud, chaotic one',
        weights: {
          genres: { Humor: 2, Contemporary: 1 },
          moods: { giddy: 2 },
          gives: { 'make me laugh': 2 },
          pace: { 'page-turner': 2 },
          ending: { happy: 1 },
          length: { short: 1 },
          style: { witty: 2 },
        },
      },
    ],
  },
  {
    id: 'q-27',
    prompt: 'A story of rebellion or a story of belonging?',
    options: [
      {
        label: 'Rebellion',
        weights: {
          genres: { Fantasy: 2, 'Young Adult': 1 },
          moods: { restless: 2 },
          gives: { 'make me think': 2 },
          pace: { 'page-turner': 2 },
          ending: { open: 1 },
          length: { medium: 1 },
          style: { dark: 1 },
        },
      },
      {
        label: 'Belonging',
        weights: {
          genres: { Contemporary: 2, Romance: 1 },
          moods: { calm: 2 },
          gives: { 'comfort me': 2 },
          pace: { steady: 1 },
          ending: { happy: 2 },
          length: { medium: 1 },
          style: { 'simple & easy': 1 },
        },
      },
    ],
  },
  {
    id: 'q-28',
    prompt: 'A book with a perfect final line or a book with a giant twist?',
    options: [
      {
        label: 'Perfect final line',
        weights: {
          genres: { Classics: 2, Poetry: 1 },
          moods: { nostalgic: 1 },
          gives: { 'make me think': 2 },
          pace: { 'slow-burn': 1 },
          ending: { bittersweet: 2 },
          length: { long: 1 },
          style: { lyrical: 2 },
        },
      },
      {
        label: 'Giant twist',
        weights: {
          genres: { 'Mystery/Thriller': 3, Horror: 1 },
          moods: { restless: 2 },
          gives: { 'thrill me': 2 },
          pace: { 'page-turner': 2 },
          ending: { twist: 3 },
          length: { short: 1 },
          style: { dark: 1 },
        },
      },
    ],
  },
  {
    id: 'q-29',
    prompt: 'A hopeful future or a haunting past?',
    options: [
      {
        label: 'Hopeful future',
        weights: {
          genres: { 'Sci-Fi': 3, Fantasy: 1 },
          moods: { happy: 2 },
          gives: { 'escape from everyday life': 2 },
          pace: { steady: 1 },
          ending: { happy: 2 },
          length: { medium: 1 },
          style: { 'simple & easy': 1 },
        },
      },
      {
        label: 'Haunting past',
        weights: {
          genres: { Historical: 2, Horror: 1 },
          moods: { sad: 1, nostalgic: 1 },
          gives: { 'make me think': 2 },
          pace: { 'slow-burn': 1 },
          ending: { bittersweet: 2 },
          length: { long: 1 },
          style: { poetic: 1 },
        },
      },
    ],
  },
  {
    id: 'q-30',
    prompt: 'A story about love or a story about survival?',
    options: [
      {
        label: 'Love',
        weights: {
          genres: { Romance: 3, Contemporary: 1 },
          moods: { happy: 2, giddy: 1 },
          gives: { 'make me happy': 2 },
          pace: { steady: 1 },
          ending: { happy: 2 },
          length: { medium: 1 },
          style: { witty: 1 },
        },
      },
      {
        label: 'Survival',
        weights: {
          genres: { Horror: 2, 'Mystery/Thriller': 2 },
          moods: { scared: 2, restless: 1 },
          gives: { 'thrill me': 2 },
          pace: { 'page-turner': 2 },
          ending: { twist: 1 },
          length: { medium: 1 },
          style: { dark: 1 },
        },
      },
    ],
  },
];

export const buildQuizSet = (excludeIds = []) => {
  const pool = QUIZ_QUESTIONS.filter((question) => !excludeIds.includes(question.id));
  const shuffled = [...pool];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled.slice(0, 5);
};

export const mergeWeightMaps = (base = {}, incoming = {}) => {
  const merged = {
    genres: { ...(base.genres || {}) },
    moods: { ...(base.moods || {}) },
    gives: { ...(base.gives || {}) },
    pace: { ...(base.pace || {}) },
    ending: { ...(base.ending || {}) },
    length: { ...(base.length || {}) },
    style: { ...(base.style || {}) },
  };

  Object.entries(incoming).forEach(([group, values]) => {
    if (!values || typeof values !== 'object') return;

    Object.entries(values).forEach(([key, value]) => {
      merged[group] = merged[group] || {};
      merged[group][key] = (merged[group][key] || 0) + Number(value || 0);
    });
  });

  return merged;
};

export const getTopWeightEntries = (weightMap = {}) => {
  return Object.entries(weightMap)
    .sort(([, left], [, right]) => Number(right) - Number(left))
    .map(([key]) => key);
};
