import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import TopBar from '../components/TopBar.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import './SettingsScreen.css';

const READING_LANGUAGES = ['Any', 'Greek original', 'English'];

export default function SettingsScreen() {
  const navigate = useNavigate();
  const { settings, updateSettings, clearAllData } = useAppContext();

  const handleToggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  const handleSpoilers = () => {
    updateSettings({ spoilersDefault: settings.spoilersDefault === 'hidden' ? 'show' : 'hidden' });
  };

  const handleClearAll = () => {
    const confirmed = window.confirm('Clear all app data? This removes your profile, saved recommendations and settings.');
    if (!confirmed) return;

    clearAllData();
    navigate('/onboarding');
  };

  return (
    <main className="settings-screen">
      <TopBar title="Settings" backTo="/profile" />

      <section className="settings-card">
        <div className="settings-row">
          <div>
            <h3>Dark mode</h3>
          </div>
          <button
            aria-label="Toggle dark mode"
            aria-pressed={settings.theme === 'dark'}
            className={`settings-switch ${settings.theme === 'dark' ? 'is-on' : ''}`}
            onClick={handleToggleTheme}
            type="button"
          >
            <span />
          </button>
        </div>

        <div className="settings-row">
          <div>
            <h3>Default spoilers</h3>
            <p>{settings.spoilersDefault === 'hidden' ? 'Hidden' : 'Shown'}</p>
          </div>
          <button
            className="settings-inline-button"
            onClick={handleSpoilers}
            type="button"
          >
            {settings.spoilersDefault === 'hidden' ? 'Hidden' : 'Shown'}
          </button>
        </div>

        <div className="settings-row">
          <div>
            <h3>Notifications</h3>
            <p>New books matching your taste</p>
          </div>
          <button
            aria-label="Toggle book notifications"
            aria-pressed={settings.notifications}
            className={`settings-switch ${settings.notifications ? 'is-on' : ''}`}
            onClick={() => updateSettings({ notifications: !settings.notifications })}
            type="button"
          >
            <span />
          </button>
        </div>

        <label className="settings-row settings-row--stacked">
          <div>
            <h3>Reading language</h3>
          </div>
          <select
            onChange={(event) => updateSettings({ readingLanguage: event.target.value })}
            value={settings.readingLanguage || 'any'}
          >
            {READING_LANGUAGES.map((language) => (
              <option key={language} value={language === 'Any' ? 'any' : language.toLowerCase()}>
                {language}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="settings-card">
        <div className="settings-row">
          <div>
            <h3>App tour</h3>
            <p>Replay the first-time guide</p>
          </div>
          <button
            className="settings-inline-button"
            onClick={() => {
              updateSettings({ hasSeenAppTour: false });
              navigate('/home');
            }}
            type="button"
          >
            Show app tour again
          </button>
        </div>
      </section>

      <section className="settings-card settings-card--danger">
        <h3>App data</h3>
        <Button className="settings-danger-button" onClick={handleClearAll} variant="ghost">Clear all app data</Button>
      </section>

      <section className="settings-card">
        <h3>About</h3>
        <p>App version: 0.1 mockup</p>
        <p>University project — AUEB</p>
      </section>

      <section className="settings-card">
        <h3>Privacy note</h3>
        <p>This mockup stores your reading profile locally on this device for personalization only.</p>
      </section>
    </main>
  );
}
