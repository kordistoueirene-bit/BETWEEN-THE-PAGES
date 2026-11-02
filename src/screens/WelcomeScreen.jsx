import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import './WelcomeScreen.css';

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const { userProfile, resetProfile } = useAppContext();

  const startOver = () => {
    resetProfile();
    navigate('/onboarding');
  };

  return (
    <main className="welcome-screen">
      <div className="welcome-illustration">
        <svg
          aria-label="A reader taking a quiet moment with an open book"
          role="img"
          viewBox="0 0 320 300"
        >
          <ellipse cx="160" cy="270" fill="#D9A94F" opacity="0.45" rx="122" ry="17" />
          <path d="M91 248c5-48 24-79 69-82 45 3 64 34 69 82z" fill="#D87568" />
          <path d="M112 202c-18 17-28 32-37 47m133-47c18 17 28 32 37 47" fill="none" stroke="#B75D55" strokeLinecap="round" strokeWidth="19" />
          <circle cx="160" cy="98" r="53" fill="#E7A47D" />
          <path d="M108 101c-4-48 20-72 55-72 36 0 54 26 49 67-10-10-17-24-20-37-15 17-44 27-84 27z" fill="#2E3440" />
          <path d="M140 107h2m37 0h2" stroke="#2E3440" strokeLinecap="round" strokeWidth="5" />
          <path d="M151 127c7 5 13 5 20 0" fill="none" stroke="#9F5D4D" strokeLinecap="round" strokeWidth="3" />
          <path d="M87 220c26-20 50-28 73-25v44c-25-5-49 2-73 20z" fill="#FFFCF6" stroke="#2E3440" strokeLinejoin="round" strokeWidth="4" />
          <path d="M233 220c-26-20-50-28-73-25v44c25-5 49 2 73 20z" fill="#F7EEDC" stroke="#2E3440" strokeLinejoin="round" strokeWidth="4" />
          <path d="M160 196v43" stroke="#D4C8B2" strokeWidth="2" />
          <path d="M75 238c7-8 15-12 24-12m146 12c-7-8-15-12-24-12" fill="none" stroke="#E7A47D" strokeLinecap="round" strokeWidth="13" />
          <path d="M123 212c9-3 17-4 25-2m49 2c-9-3-17-4-25-2" fill="none" stroke="#D8CBB7" strokeLinecap="round" strokeWidth="2" />
          <circle cx="66" cy="95" r="6" fill="#FFFCF6" />
          <circle cx="258" cy="126" r="8" fill="#7FB7A8" />
          <path d="m246 64 4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z" fill="#E8A5A0" />
        </svg>
      </div>

      <div className="welcome-copy">
        <p className="welcome-eyebrow">A little space for your next story</p>
        <h1>Between <em>the Pages</em></h1>
        <p className="welcome-tagline">Find the right book for the mood you're in.</p>
        <div className="welcome-actions">
          {userProfile ? (
            <>
              <Button to="/home">Continue</Button>
              <button className="welcome-start-over" onClick={startOver} type="button">
                Start over
              </button>
            </>
          ) : (
            <Button to="/onboarding">Start</Button>
          )}
        </div>
      </div>
    </main>
  );
}