import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookCover from '../components/BookCover.jsx';
import Button from '../components/Button.jsx';
import Chip from '../components/Chip.jsx';
import TopBar from '../components/TopBar.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import { BOOKS } from '../data/index.js';
import { CONTENT_WARNINGS, FORMATS, GENRES, LANGUAGES } from '../data/taxonomy.js';
import './ProfileEditScreen.css';

const AGE_RANGES = ['under 18', '18–24', '25–34', '35–44', '45+'];
const GENDERS = ['woman', 'man', 'non-binary', 'prefer not to say'];
const READING_FREQUENCIES = ['rarely', 'a few books a year', 'monthly', 'weekly', 'always reading'];

function toggleValue(values = [], value) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export default function ProfileEditScreen() {
  const navigate = useNavigate();
  const { userProfile, setUserProfile } = useAppContext();

  const [formState, setFormState] = useState(() => ({
    name: userProfile?.name || '',
    ageRange: userProfile?.ageRange || '',
    gender: userProfile?.gender || '',
    readingFrequency: userProfile?.readingFrequency || '',
    favoriteGenres: [...(userProfile?.favoriteGenres || [])],
    booksLoved: [...(userProfile?.booksLoved || [])],
    languages: [...(userProfile?.languages || [])],
    formats: [...(userProfile?.formats || [])],
    thingsToAvoid: [...(userProfile?.thingsToAvoid || [])],
    minutesPerDay: userProfile?.minutesPerDay || 20,
  }));

  const isSelected = useMemo(() => new Set(formState.favoriteGenres), [formState.favoriteGenres]);

  const updateField = (field, value) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const toggleField = (field, value) => {
    setFormState((current) => ({
      ...current,
      [field]: toggleValue(current[field], value),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanedProfile = {
      ...userProfile,
      ...formState,
      favoriteGenres: [...new Set(formState.favoriteGenres)],
      booksLoved: [...new Set(formState.booksLoved)],
      languages: [...new Set(formState.languages)],
      formats: [...new Set(formState.formats)],
      thingsToAvoid: [...new Set(formState.thingsToAvoid)],
      minutesPerDay: Number(formState.minutesPerDay) || 20,
    };

    setUserProfile(cleanedProfile);
    navigate('/profile');
  };

  return (
    <main className="profile-edit-screen">
      <TopBar title="Edit profile" backTo="/profile" />
      <form className="profile-edit-form" onSubmit={handleSubmit}>
        <section className="profile-edit-section">
          <h2>About you</h2>
          <label className="profile-edit-field">
            <span>Name</span>
            <input onChange={(event) => updateField('name', event.target.value)} value={formState.name} />
          </label>
          <div className="profile-edit-grid">
            <div>
              <h3>Age range</h3>
              <div className="profile-edit-choice-grid">
                {AGE_RANGES.map((option) => (
                  <Chip key={option} onClick={() => updateField('ageRange', option)} selected={formState.ageRange === option}>
                    {option}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <h3>Gender</h3>
              <div className="profile-edit-choice-grid">
                {GENDERS.map((option) => (
                  <Chip key={option} onClick={() => updateField('gender', option)} selected={formState.gender === option}>
                    {option}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="profile-edit-section">
          <h2>Reading habits</h2>
          <h3>How often do you read?</h3>
          <div className="profile-edit-choice-grid">
            {READING_FREQUENCIES.map((option) => (
              <Chip key={option} onClick={() => updateField('readingFrequency', option)} selected={formState.readingFrequency === option}>
                {option}
              </Chip>
            ))}
          </div>

          <label className="profile-edit-field">
            <span>Daily reading time (minutes)</span>
            <input
              min="10"
              onChange={(event) => updateField('minutesPerDay', Number(event.target.value))}
              type="number"
              value={formState.minutesPerDay}
            />
          </label>
        </section>

        <section className="profile-edit-section">
          <h2>Genres you love</h2>
          <div className="profile-edit-choice-grid profile-edit-choice-grid--wrap">
            {GENRES.map((genre) => (
              <Chip key={genre} onClick={() => toggleField('favoriteGenres', genre)} selected={formState.favoriteGenres.includes(genre)}>
                {genre}
              </Chip>
            ))}
          </div>
        </section>

        <section className="profile-edit-section">
          <h2>Books you loved</h2>
          <div className="profile-edit-book-grid">
            {BOOKS.slice(0, 12).map((book) => {
              const isSelected = formState.booksLoved.includes(book.id);
              return (
                <button
                  aria-pressed={isSelected}
                  className={`profile-edit-book ${isSelected ? 'is-selected' : ''}`}
                  key={book.id}
                  onClick={() => toggleField('booksLoved', book.id)}
                  type="button"
                >
                  <BookCover book={book} size="sm" />
                  <span>{book.title}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="profile-edit-section">
          <h2>How you like to read</h2>
          <div className="profile-edit-grid">
            <div>
              <h3>Languages</h3>
              <div className="profile-edit-choice-grid">
                {LANGUAGES.map((language) => (
                  <Chip key={language} onClick={() => toggleField('languages', language)} selected={formState.languages.includes(language)}>
                    {language}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <h3>Formats</h3>
              <div className="profile-edit-choice-grid">
                {FORMATS.map((format) => (
                  <Chip key={format} onClick={() => toggleField('formats', format)} selected={formState.formats.includes(format)}>
                    {format}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="profile-edit-section">
          <h2>Things to avoid</h2>
          <div className="profile-edit-choice-grid profile-edit-choice-grid--wrap">
            {CONTENT_WARNINGS.map((warning) => (
              <Chip key={warning} onClick={() => toggleField('thingsToAvoid', warning)} selected={formState.thingsToAvoid.includes(warning)}>
                {warning}
              </Chip>
            ))}
          </div>
        </section>

        <div className="profile-edit-actions">
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </main>
  );
}
