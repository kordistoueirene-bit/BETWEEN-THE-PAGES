import { useMemo, useState } from 'react';
import { ArrowLeft, ChevronDown, Search, Shuffle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BOOKS } from '../data/index.js';
import { MOOD_QUESTION_SLOTS } from '../data/moodQuestions.js';
import {
  CONTENT_WARNINGS,
  ENDINGS,
  FORMATS,
  GIVES,
  LANGUAGES,
  LENGTHS,
  MOODS,
  PACE,
  PERIODS,
  POV,
  SETTINGS,
  STYLES,
  TROPES,
} from '../data/taxonomy.js';
import { estimateReadingTime, parseFreeText, scoreBook } from '../logic/recommender.js';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import Chip from '../components/Chip.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import './MoodFinderScreen.css';

const EXAMPLE_SEARCHES = [
  'a short funny book set in Greece with a twist',
  'a cozy classic with a happy ending',
  'a tense page-turner under 300 pages',
];

const ESTIMATED_PAGES = { short: 200, medium: 325, long: 500 };
const DEFAULT_FILTERS = {
  spoilers: 'hidden',
  ending: [],
  pace: [],
  style: [],
  pov: [],
  setting: [],
  period: [],
  tropes: [],
  contentWarnings: [],
  maxPages: '',
  languages: [],
  formats: [],
  era: '',
  standalone: false,
  hiddenGemsOnly: false,
  awardWinners: false,
  hasAdaptation: false,
};

function hasActiveSpecificFilters(filters = DEFAULT_FILTERS) {
  if (filters.spoilers && filters.spoilers !== 'hidden') return true;
  if (Array.isArray(filters.ending) && filters.ending.length) return true;
  if (Array.isArray(filters.pace) && filters.pace.length) return true;
  if (Array.isArray(filters.style) && filters.style.length) return true;
  if (Array.isArray(filters.pov) && filters.pov.length) return true;
  if (Array.isArray(filters.setting) && filters.setting.length) return true;
  if (Array.isArray(filters.period) && filters.period.length) return true;
  if (Array.isArray(filters.tropes) && filters.tropes.length) return true;
  if (Array.isArray(filters.contentWarnings) && filters.contentWarnings.length) return true;
  if (Array.isArray(filters.languages) && filters.languages.length) return true;
  if (Array.isArray(filters.formats) && filters.formats.length) return true;
  if (filters.era) return true;
  if (filters.maxPages !== '') return true;
  if (filters.standalone || filters.hiddenGemsOnly || filters.awardWinners || filters.hasAdaptation) return true;
  return false;
}

function pickQuestionVariants() {
  return Object.fromEntries(
    MOOD_QUESTION_SLOTS.map((slot) => [
      slot.id,
      slot.variants[Math.floor(Math.random() * slot.variants.length)],
    ]),
  );
}

function reshuffleQuestionVariants(currentVariants) {
  return Object.fromEntries(
    MOOD_QUESTION_SLOTS.map((slot) => {
      const alternatives = slot.variants.filter((variant) => variant !== currentVariants[slot.id]);
      return [slot.id, alternatives[Math.floor(Math.random() * alternatives.length)]];
    }),
  );
}

export default function MoodFinderScreen() {
  const navigate = useNavigate();
  const { userProfile, library, settings, setLastSearch, updateSettings } = useAppContext();
  const [query, setQuery] = useState('');
  const [questionVariants, setQuestionVariants] = useState(pickQuestionVariants);
  const [mood, setMood] = useState('');
  const [gives, setGives] = useState([]);
  const [length, setLength] = useState('');
  const [specificFilters, setSpecificFilters] = useState(DEFAULT_FILTERS);
  const [presetName, setPresetName] = useState('');
  const dailyMinutes = Number(userProfile?.minutesPerDay) || 20;

  const canFindBook = Boolean(
    query.trim() || mood || gives.length || length || hasActiveSpecificFilters(specificFilters),
  );

  const previewContext = useMemo(
    () => ({
      profile: userProfile,
      mood,
      gives,
      length,
      filters: specificFilters,
      freeTextPrefs: parseFreeText(query.trim()),
      library,
    }),
    [gives, length, library, mood, query, specificFilters, userProfile],
  );

  const liveMatchCount = useMemo(
    () => BOOKS.filter((book) => scoreBook(book, previewContext)).length,
    [previewContext],
  );

  const toggleGive = (give) => {
    setGives((current) => {
      if (current.includes(give)) return current.filter((value) => value !== give);
      if (current.length >= 2) return current;
      return [...current, give];
    });
  };

  const toggleMultiSelect = (key, value) => {
    setSpecificFilters((current) => {
      const selected = Array.isArray(current[key]) ? current[key] : [];
      const nextValues = selected.includes(value)
        ? selected.filter((entry) => entry !== value)
        : [...selected, value];

      return { ...current, [key]: nextValues };
    });
  };

  const toggleFlag = (key) => {
    setSpecificFilters((current) => ({ ...current, [key]: !current[key] }));
  };

  const clearFilters = () => {
    setSpecificFilters(DEFAULT_FILTERS);
    setPresetName('');
  };

  const savePreset = () => {
    const currentPresets = Array.isArray(settings?.presets) ? settings.presets : [];
    const label = presetName.trim() || `Preset ${currentPresets.length + 1}`;
    const nextPreset = { id: `${Date.now()}-${label}`, name: label, filters: specificFilters };

    updateSettings({ presets: [nextPreset, ...currentPresets].slice(0, 5) });
    setPresetName('');
  };

  const applyPreset = (preset) => {
    setSpecificFilters({ ...DEFAULT_FILTERS, ...(preset?.filters ?? {}) });
    setPresetName('');
  };

  const differentQuestions = () => {
    setQuestionVariants((current) => reshuffleQuestionVariants(current));
  };

  const findBook = () => {
    if (!canFindBook) return;
    const search = {
      query: query.trim(),
      profile: userProfile,
      mood,
      gives,
      length,
      filters: specificFilters,
      freeTextPrefs: parseFreeText(query.trim()),
      library,
    };

    setLastSearch(search);
    navigate('/results');
  };

  const renderChipGroup = (key, values, title) => (
    <div className="mood-filter-group" key={key}>
      <div className="mood-filter-group__header">
        <h3>{title}</h3>
      </div>
      <div className="mood-filter-options">
        {values.map((value) => (
          <Chip
            key={value}
            onClick={() => toggleMultiSelect(key, value)}
            selected={Array.isArray(specificFilters[key]) && specificFilters[key].includes(value)}
          >
            {value}
          </Chip>
        ))}
      </div>
    </div>
  );

  return (
    <main className="mood-screen">
      <header className="mood-header">
        <Link aria-label="Back to Home" className="mood-back" to="/home">
          <ArrowLeft aria-hidden="true" size={21} />
        </Link>
        <label className="mood-search-bar">
          <Search aria-hidden="true" size={20} />
          <input
            autoComplete="off"
            autoFocus
            onChange={(event) => setQuery(event.target.value)}
            placeholder="What are you in the mood to read?"
            type="search"
            value={query}
          />
        </label>
      </header>

      <div className="mood-content">
        <div aria-label="Example searches" className="mood-suggestions">
          {EXAMPLE_SEARCHES.map((example) => (
            <Chip key={example} onClick={() => setQuery(example)}>
              {example}
            </Chip>
          ))}
        </div>

        <Card className="mood-quick-card">
          <div className="mood-quick-card__header">
            <h1>Quick questions</h1>
            <button className="mood-reshuffle" onClick={differentQuestions} type="button">
              <Shuffle aria-hidden="true" size={14} />
              <span>Different questions</span>
            </button>
          </div>

          <section aria-labelledby="mood-question-title" className="mood-question-group">
            <h2 id="mood-question-title">{questionVariants.mood}</h2>
            <div aria-label="Choose your mood" className="mood-mood-grid">
              {MOODS.map((option) => (
                <button
                  aria-pressed={mood === option.id}
                  className={`mood-mood-option${mood === option.id ? ' is-selected' : ''}`}
                  key={option.id}
                  onClick={() => setMood((current) => current === option.id ? '' : option.id)}
                  style={{ '--mood-color': option.color }}
                  type="button"
                >
                  <span aria-hidden="true" className="mood-mood-option__emoji">{option.emoji}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section aria-labelledby="gives-question-title" className="mood-question-group">
            <div className="mood-question-group__heading">
              <h2 id="gives-question-title">{questionVariants.gives}</h2>
              <span>Choose up to 2</span>
            </div>
            <div className="mood-gives-list">
              {GIVES.map((give) => (
                <Chip
                  key={give}
                  onClick={() => toggleGive(give)}
                  selected={gives.includes(give)}
                >
                  {give}
                </Chip>
              ))}
            </div>
          </section>

          <section aria-labelledby="length-question-title" className="mood-question-group">
            <h2 id="length-question-title">{questionVariants.length}</h2>
            <div className="mood-length-grid">
              {LENGTHS.map((option) => (
                <button
                  aria-pressed={length === option.id}
                  className={`mood-length-option${length === option.id ? ' is-selected' : ''}`}
                  key={option.id}
                  onClick={() => setLength((current) => current === option.id ? '' : option.id)}
                  type="button"
                >
                  <strong>{option.label}</strong>
                  <span>{option.description}</span>
                  <small>{estimateReadingTime(ESTIMATED_PAGES[option.id], dailyMinutes)}</small>
                </button>
              ))}
            </div>
          </section>
        </Card>

        <details className="mood-specific" open>
          <summary>
            <span className="mood-specific__title">🎯 Get specific</span>
            <span className="mood-specific__coming">{liveMatchCount} matches</span>
            <ChevronDown aria-hidden="true" className="mood-specific__chevron" size={18} />
          </summary>

          <div className="mood-specific__content">
            <div className="mood-specific__toolbar">
              <button className="mood-filter-action" onClick={clearFilters} type="button">
                Clear all
              </button>
              <div className="mood-preset-input-wrap">
                <input
                  className="mood-preset-input"
                  onChange={(event) => setPresetName(event.target.value)}
                  placeholder="Name this search"
                  type="text"
                  value={presetName}
                />
              </div>
              <button className="mood-filter-action mood-filter-action--primary" onClick={savePreset} type="button">
                Save preset
              </button>
            </div>

            {settings?.presets?.length ? (
              <div className="mood-presets">
                {settings.presets.map((preset) => (
                  <Chip key={preset.id} onClick={() => applyPreset(preset)}>
                    {preset.name}
                  </Chip>
                ))}
              </div>
            ) : null}

            <div className="mood-filter-sections">
              <div className="mood-filter-group">
                <div className="mood-filter-group__header">
                  <h3>Spoilers</h3>
                </div>
                <div className="mood-filter-options mood-filter-options--compact">
                  {['hidden', 'show'].map((value) => (
                    <Chip
                      key={value}
                      onClick={() => setSpecificFilters((current) => ({ ...current, spoilers: value }))}
                      selected={specificFilters.spoilers === value}
                    >
                      {value === 'hidden' ? 'Hide spoilers' : 'Show spoilers'}
                    </Chip>
                  ))}
                </div>
              </div>

              {renderChipGroup('ending', ENDINGS, 'Ending')}
              {renderChipGroup('pace', PACE, 'Pace')}
              {renderChipGroup('style', STYLES, 'Writing style')}
              {renderChipGroup('pov', POV, 'Point of view')}
              {renderChipGroup('setting', SETTINGS, 'Setting')}
              {renderChipGroup('period', PERIODS, 'Time period')}
              {renderChipGroup('tropes', TROPES, 'Tropes')}
              {renderChipGroup('contentWarnings', CONTENT_WARNINGS, 'Content to avoid')}
              {renderChipGroup('languages', LANGUAGES, 'Greek availability')}
              {renderChipGroup('formats', FORMATS, 'Format')}

              <div className="mood-filter-group">
                <div className="mood-filter-group__header">
                  <h3>Era</h3>
                </div>
                <div className="mood-filter-options mood-filter-options--compact">
                  {['', 'classic', 'modern', 'brand new'].map((value) => (
                    <Chip
                      key={value || 'any-era'}
                      onClick={() => setSpecificFilters((current) => ({ ...current, era: value }))}
                      selected={specificFilters.era === value}
                    >
                      {value === '' ? 'Any era' : value === 'brand new' ? 'Brand new' : value === 'classic' ? 'Classic' : 'Modern'}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="mood-filter-group">
                <div className="mood-filter-group__header">
                  <h3>Extra filters</h3>
                </div>
                <div className="mood-filter-options mood-filter-options--compact">
                  <Chip onClick={() => toggleFlag('standalone')} selected={specificFilters.standalone}>
                    Standalone only
                  </Chip>
                  <Chip onClick={() => toggleFlag('hiddenGemsOnly')} selected={specificFilters.hiddenGemsOnly}>
                    Hidden gems
                  </Chip>
                  <Chip onClick={() => toggleFlag('awardWinners')} selected={specificFilters.awardWinners}>
                    Award winners
                  </Chip>
                  <Chip onClick={() => toggleFlag('hasAdaptation')} selected={specificFilters.hasAdaptation}>
                    Has adaptation
                  </Chip>
                </div>
              </div>

              <div className="mood-filter-group mood-filter-group--stacked">
                <div className="mood-filter-group__header">
                  <h3>Max pages</h3>
                </div>
                <input
                  className="mood-number-input"
                  max="1000"
                  min="0"
                  onChange={(event) =>
                    setSpecificFilters((current) => ({ ...current, maxPages: event.target.value }))
                  }
                  placeholder="e.g. 320"
                  type="number"
                  value={specificFilters.maxPages}
                />
              </div>
            </div>
          </div>
        </details>
      </div>

      <footer className="mood-actions">
        <Button disabled={!canFindBook} onClick={findBook}>Find my book</Button>
      </footer>
    </main>
  );
}