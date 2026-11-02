import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BookCover from '../components/BookCover.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import Chip from '../components/Chip.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import { BOOKS } from '../data/index.js';
import { CONTENT_WARNINGS, GENRES } from '../data/taxonomy.js';
import './OnboardingScreen.css';

const TOTAL_QUESTIONS = 9;
const OPTIONAL_STEPS = new Set([2, 5, 7]);
const AGE_RANGES = ['under 18', '18–24', '25–34', '35–44', '45+'];
const GENDERS = ['woman', 'man', 'non-binary', 'prefer not to say'];
const READING_FREQUENCIES = ['rarely', 'a few books a year', 'monthly', 'weekly', 'always reading'];
const LANGUAGES = ['Greek', 'English'];
const FORMATS = ['print', 'ebook', 'audiobook'];
const READING_TIMES = [
  { value: 10, label: '10 minutes' },
  { value: 20, label: '20 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '60+ minutes' },
];

const questions = [
  { title: 'What should we call you?', description: 'A name makes your recommendations feel more personal.' },
  { title: 'What age range are you in?', description: 'We use this to help shape your reading suggestions.' },
  { title: 'How do you describe yourself?', description: 'This question is optional.' },
  { title: 'How often do you read?', description: 'There is no right answer.' },
  { title: 'What do you love to read?', description: 'Choose at least one genre.' },
  { title: 'Which books have you loved?', description: 'Pick any that feel like your kind of story.' },
  { title: 'How do you like to read?', description: 'Choose at least one language and one format.' },
  { title: 'Anything you never want in a book?', description: 'Choose any topics you would rather avoid.' },
  { title: 'How much time do you read each day?', description: 'We’ll use this to suggest a comfortable reading pace.' },
];

const initialAnswers = {
  name: '',
  ageRange: '',
  gender: '',
  readingFrequency: '',
  favoriteGenres: [],
  booksLoved: [],
  languages: [],
  formats: [],
  thingsToAvoid: [],
  minutesPerDay: null,
};

function toggleValue(values, value) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function ChoiceGrid({ options, selected, onSelect, multiple = false, className = '' }) {
  return (
    <div className={['onboarding-choice-grid', className].filter(Boolean).join(' ')}>
      {options.map((option) => {
        const value = typeof option === 'string' ? option : option.value;
        const label = typeof option === 'string' ? option : option.label;
        const isSelected = multiple ? selected.includes(value) : selected === value;

        return (
          <Chip
            key={value}
            onClick={() => onSelect(value)}
            selected={isSelected}
          >
            {label}
          </Chip>
        );
      })}
    </div>
  );
}

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const { setUserProfile } = useAppContext();
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState('forward');
  const [answers, setAnswers] = useState(initialAnswers);

  const updateAnswer = (key, value) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  };

  const toggleAnswer = (key, value) => {
    setAnswers((current) => ({ ...current, [key]: toggleValue(current[key], value) }));
  };

  const isFinalScreen = stepIndex === TOTAL_QUESTIONS;
  const question = questions[stepIndex];

  const canContinue = () => {
    switch (stepIndex) {
      case 0:
        return answers.name.trim().length > 0;
      case 1:
        return Boolean(answers.ageRange);
      case 2:
        return true;
      case 3:
        return Boolean(answers.readingFrequency);
      case 4:
        return answers.favoriteGenres.length > 0;
      case 5:
        return true;
      case 6:
        return answers.languages.length > 0 && answers.formats.length > 0;
      case 7:
        return true;
      case 8:
        return Boolean(answers.minutesPerDay);
      default:
        return false;
    }
  };

  const goBack = () => {
    if (stepIndex === 0) {
      navigate('/');
      return;
    }
    setDirection('backward');
    setStepIndex((current) => current - 1);
  };

  const goForward = () => {
    if (!canContinue()) return;
    setDirection('forward');
    setStepIndex((current) => Math.min(TOTAL_QUESTIONS, current + 1));
  };

  const skipStep = () => {
    setDirection('forward');
    setStepIndex((current) => Math.min(TOTAL_QUESTIONS, current + 1));
  };

  const buildProfile = () => {
    const preferredLanguages = answers.languages.flatMap((language) =>
      language === 'Greek' ? ['Greek original', 'Greek translation available'] : ['English'],
    );
    const avoidWarnings = answers.thingsToAvoid.filter((item) => CONTENT_WARNINGS.includes(item));

    return {
      name: answers.name.trim(),
      ageRange: answers.ageRange,
      gender: answers.gender || null,
      readingFrequency: answers.readingFrequency,
      favoriteGenres: answers.favoriteGenres,
      booksLoved: answers.booksLoved,
      languages: answers.languages,
      preferredLanguages,
      formats: answers.formats,
      preferredFormats: answers.formats,
      thingsToAvoid: answers.thingsToAvoid,
      contentWarningsToAvoid: avoidWarnings,
      excludedGenres: answers.thingsToAvoid.includes('romance') ? ['Romance'] : [],
      minutesPerDay: answers.minutesPerDay,
    };
  };

  const finishOnboarding = () => {
    setUserProfile(buildProfile());
    navigate('/home');
  };

  const renderQuestion = () => {
    switch (stepIndex) {
      case 0:
        return (
          <label className="onboarding-name-field">
            <span>Your name</span>
            <input
              autoComplete="given-name"
              autoFocus
              onChange={(event) => updateAnswer('name', event.target.value)}
              placeholder="e.g. Alex"
              value={answers.name}
            />
          </label>
        );
      case 1:
        return (
          <ChoiceGrid
            onSelect={(value) => updateAnswer('ageRange', value)}
            options={AGE_RANGES}
            selected={answers.ageRange}
          />
        );
      case 2:
        return (
          <ChoiceGrid
            onSelect={(value) => updateAnswer('gender', value)}
            options={GENDERS}
            selected={answers.gender}
          />
        );
      case 3:
        return (
          <ChoiceGrid
            className="onboarding-choice-grid--stacked"
            onSelect={(value) => updateAnswer('readingFrequency', value)}
            options={READING_FREQUENCIES}
            selected={answers.readingFrequency}
          />
        );
      case 4:
        return (
          <ChoiceGrid
            multiple
            onSelect={(value) => toggleAnswer('favoriteGenres', value)}
            options={GENRES}
            selected={answers.favoriteGenres}
          />
        );
      case 5:
        return (
          <div className="onboarding-book-grid">
            {BOOKS.slice(0, 12).map((book) => {
              const isSelected = answers.booksLoved.includes(book.id);
              return (
                <button
                  aria-label={`${book.title} by ${book.author}${isSelected ? ', selected' : ''}`}
                  aria-pressed={isSelected}
                  className={`onboarding-book-choice${isSelected ? ' is-selected' : ''}`}
                  key={book.id}
                  onClick={() => toggleAnswer('booksLoved', book.id)}
                  type="button"
                >
                  <BookCover book={book} size="sm" />
                  <span>{book.title}</span>
                  {isSelected && <span aria-hidden="true" className="onboarding-book-check">✓</span>}
                </button>
              );
            })}
          </div>
        );
      case 6:
        return (
          <div className="onboarding-preference-groups">
            <section aria-labelledby="onboarding-languages-heading">
              <h2 id="onboarding-languages-heading">Languages</h2>
              <ChoiceGrid
                multiple
                onSelect={(value) => toggleAnswer('languages', value)}
                options={LANGUAGES}
                selected={answers.languages}
              />
            </section>
            <section aria-labelledby="onboarding-formats-heading">
              <h2 id="onboarding-formats-heading">Formats</h2>
              <ChoiceGrid
                multiple
                onSelect={(value) => toggleAnswer('formats', value)}
                options={FORMATS}
                selected={answers.formats}
              />
            </section>
          </div>
        );
      case 7:
        return (
          <ChoiceGrid
            multiple
            onSelect={(value) => toggleAnswer('thingsToAvoid', value)}
            options={[...CONTENT_WARNINGS, 'romance']}
            selected={answers.thingsToAvoid}
          />
        );
      case 8:
        return (
          <ChoiceGrid
            onSelect={(value) => updateAnswer('minutesPerDay', value)}
            options={READING_TIMES}
            selected={answers.minutesPerDay}
          />
        );
      default:
        return null;
    }
  };

  const renderSummary = () => {
    const languages = answers.languages.length ? answers.languages.join(', ') : 'Not specified';
    const avoid = answers.thingsToAvoid.length ? answers.thingsToAvoid.join(', ') : 'Nothing selected';
    const genres = answers.favoriteGenres.length ? answers.favoriteGenres.slice(0, 4).join(', ') : 'Not specified';

    return (
      <>
        <p className="onboarding-kicker">A lovely place to begin</p>
        <h1 className="onboarding-question-title">Your reading profile is ready <span aria-hidden="true">✨</span></h1>
        <p className="onboarding-question-description">Here’s what we’ll keep in mind for your picks.</p>
        <Card className="onboarding-summary-card">
          <dl>
            <div><dt>Name</dt><dd>{answers.name.trim()}</dd></div>
            <div><dt>Favorite genres</dt><dd>{genres}</dd></div>
            <div><dt>Languages</dt><dd>{languages}</dd></div>
            <div><dt>Avoid</dt><dd>{avoid}</dd></div>
          </dl>
        </Card>
      </>
    );
  };

  return (
    <main className="onboarding-screen">
      <header className="onboarding-header">
        <button aria-label="Go back" className="onboarding-back" onClick={goBack} type="button">
          <ArrowLeft aria-hidden="true" size={20} />
        </button>
        <span>Your reading profile</span>
        <span aria-hidden="true" className="onboarding-header-spacer" />
      </header>

      {!isFinalScreen && (
        <div className="onboarding-progress">
          <div className="onboarding-progress-label">
            <span>Getting to know you</span>
            <span>Step {stepIndex + 1} of {TOTAL_QUESTIONS}</span>
          </div>
          <ProgressBar
            label={`Step ${stepIndex + 1} of ${TOTAL_QUESTIONS}`}
            value={((stepIndex + 1) / TOTAL_QUESTIONS) * 100}
          />
        </div>
      )}

      <div
        aria-live="polite"
        className={`onboarding-step onboarding-step--${direction}`}
        key={stepIndex}
      >
        {!isFinalScreen ? (
          <>
            <p className="onboarding-kicker">Step {stepIndex + 1}</p>
            <h1 className="onboarding-question-title">{question.title}</h1>
            <p className="onboarding-question-description">{question.description}</p>
            {renderQuestion()}
          </>
        ) : renderSummary()}
      </div>

      <footer className={`onboarding-actions${OPTIONAL_STEPS.has(stepIndex) ? ' has-skip' : ''}`}>
        {OPTIONAL_STEPS.has(stepIndex) && (
          <button className="onboarding-skip" onClick={skipStep} type="button">Skip</button>
        )}
        {!isFinalScreen ? (
          <Button disabled={!canContinue()} onClick={goForward}>
            {stepIndex === TOTAL_QUESTIONS - 1 ? 'Finish' : 'Next'}
          </Button>
        ) : (
          <Button onClick={finishOnboarding}>Show me books</Button>
        )}
      </footer>
    </main>
  );
}