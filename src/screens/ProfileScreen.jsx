import { useMemo, useRef, useState } from 'react';
import {
  BookOpenText,
  CircleUserRound,
  PenSquare,
  Pencil,
  RefreshCw,
  Settings,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getReadingPersonality } from '../data/personalities.js';
import { useAppContext } from '../context/AppContext.jsx';
import './ProfileScreen.css';

const createAvatarSvg = (base, accent, highlight, stroke) => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="avatar illustration">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="${base}" />
        <stop offset="100%" stop-color="${highlight}" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="60" fill="url(#bg)"/>
    <circle cx="60" cy="48" r="22" fill="${stroke}" opacity="0.92"/>
    <path d="M35 93c5-16 18-24 25-24s20 8 25 24" fill="${accent}" opacity="0.8"/>
    <path d="M23 33c9-12 19-16 35-16 17 0 28 5 36 17-11 0-20 5-25 12-7-9-21-13-46-13z" fill="${stroke}" opacity="0.26"/>
  </svg>
`;

const avatarPresets = [
  { id: 'sunset', name: 'Sunset', src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(createAvatarSvg('#F2C46D', '#E8A5A0', '#FBF6EC', '#2E3440'))}` },
  { id: 'sage', name: 'Sage', src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(createAvatarSvg('#7FB7A8', '#FBE7BE', '#FBF6EC', '#2E3440'))}` },
  { id: 'rose', name: 'Rose', src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(createAvatarSvg('#E8A5A0', '#F2C46D', '#FBF6EC', '#2E3440'))}` },
  { id: 'midnight', name: 'Midnight', src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(createAvatarSvg('#2E3440', '#7FB7A8', '#FBE7BE', '#FBF6EC'))}` },
  { id: 'mustard', name: 'Mustard', src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(createAvatarSvg('#FBE7BE', '#7FB7A8', '#FBF6EC', '#2E3440'))}` },
  { id: 'embers', name: 'Embers', src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(createAvatarSvg('#F2C46D', '#E8A5A0', '#FBE7BE', '#2E3440'))}` },
  { id: 'forest', name: 'Forest', src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(createAvatarSvg('#7FB7A8', '#FBE7BE', '#2E3440', '#FBF6EC'))}` },
  { id: 'lavender', name: 'Lavender', src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(createAvatarSvg('#D8C2D6', '#E8A5A0', '#FBF6EC', '#2E3440'))}` },
];

const menuItems = [
  { label: 'Edit reading profile', to: '/profile/edit', Icon: PenSquare },
  { label: 'Take a quick quiz', to: '/profile/quiz', Icon: Sparkles },
  { label: 'My Library', to: '/library', Icon: BookOpenText },
  { label: 'Settings', to: '/settings', Icon: Settings },
];

export default function ProfileScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { userProfile, setUserProfile, resetProfile } = useAppContext();
  const [showResetModal, setShowResetModal] = useState(false);
  const [showAvatarSheet, setShowAvatarSheet] = useState(false);

  const profile = userProfile || {
    name: 'Reader',
    favoriteGenres: ['Fantasy', 'Romance'],
    languages: ['English'],
    thingsToAvoid: ['gore'],
    mood: 'calm',
  };

  const personality = useMemo(() => getReadingPersonality(profile), [profile]);
  const topGenres = Array.isArray(profile.favoriteGenres) ? profile.favoriteGenres.slice(0, 3) : [];
  const languages = Array.isArray(profile.languages) ? profile.languages.slice(0, 3) : ['English'];
  const avoids = Array.isArray(profile.thingsToAvoid) ? profile.thingsToAvoid.slice(0, 3) : ['none'];
  const initials = (profile.name || 'Reader')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'R';
  const joinedAt = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const handleReset = () => {
    resetProfile();
    setShowResetModal(false);
    navigate('/onboarding');
  };

  const handleAvatarSelect = (src) => {
    const nextProfile = { ...profile, avatar: src };
    setUserProfile(nextProfile);
    setShowAvatarSheet(false);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDimension = 300;
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));

        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setUserProfile({ ...profile, avatar: dataUrl });
        setShowAvatarSheet(false);
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleRemovePhoto = () => {
    const nextProfile = { ...profile };
    delete nextProfile.avatar;
    setUserProfile(nextProfile);
    setShowAvatarSheet(false);
  };

  return (
    <main className="profile-screen">
      <header className="profile-header">
        <button
          aria-label="Choose profile avatar"
          className="profile-avatar-button"
          onClick={() => setShowAvatarSheet(true)}
          type="button"
        >
          {profile.avatar ? (
            <img alt="Profile avatar" className="profile-avatar__image" src={profile.avatar} />
          ) : (
            <span className="profile-avatar" aria-label="User avatar">{initials}</span>
          )}
          <span aria-hidden="true" className="profile-avatar__badge"><Pencil size={12} /></span>
        </button>
        <div className="profile-header__copy">
          <h1>{profile.name || 'Reader'}</h1>
          <p>Reader since {joinedAt}</p>
        </div>
      </header>

      <div className="profile-personality-pill">
        <CircleUserRound size={18} />
        <span>{personality}</span>
      </div>

      <section className="profile-summary">
        <div className="profile-section-header">
          <h2>Your taste</h2>
        </div>
        <div className="profile-chip-wrap">
          {topGenres.map((genre) => (
            <span className="profile-chip" key={genre}>{genre}</span>
          ))}
          {languages.map((language) => (
            <span className="profile-chip profile-chip--soft" key={language}>{language}</span>
          ))}
          {avoids.map((avoid) => (
            <span className="profile-chip profile-chip--muted" key={avoid}>{avoid}</span>
          ))}
        </div>
      </section>

      <nav className="profile-menu" aria-label="Profile menu">
        {menuItems.map(({ label, to, Icon }) => (
          <button
            className="profile-menu__item"
            key={label}
            onClick={() => {
              const nextState = to === '/library' ? { state: { origin: 'profile' } } : undefined;
              navigate(to, nextState);
            }}
            type="button"
          >
            <span className="profile-menu__icon"><Icon size={18} /></span>
            <span>{label}</span>
          </button>
        ))}
        <button className="profile-menu__item profile-menu__item--danger" onClick={() => setShowResetModal(true)} type="button">
          <span className="profile-menu__icon"><Trash2 size={18} /></span>
          <span>Reset my profile</span>
        </button>
      </nav>

      {showAvatarSheet && (
        <div className="profile-avatar-sheet-backdrop" onClick={() => setShowAvatarSheet(false)}>
          <div aria-labelledby="avatar-picker-title" aria-modal="true" className="profile-avatar-sheet" onClick={(event) => event.stopPropagation()} role="dialog">
            <div className="profile-avatar-sheet__header">
              <h3 id="avatar-picker-title">Choose an avatar</h3>
              <button className="profile-avatar-sheet__close" onClick={() => setShowAvatarSheet(false)} type="button">Close</button>
            </div>

            <div className="profile-avatar-grid">
              {avatarPresets.map((preset) => (
                <button
                  aria-label={`Use ${preset.name} avatar`}
                  className="profile-avatar-option"
                  key={preset.id}
                  onClick={() => handleAvatarSelect(preset.src)}
                  type="button"
                >
                  <img alt={preset.name} src={preset.src} />
                </button>
              ))}
            </div>

            <label className="profile-avatar-upload">
              <input accept="image/*" onChange={handlePhotoUpload} ref={fileInputRef} type="file" />
              <span>Upload a photo</span>
            </label>

            <button className="profile-avatar-remove" onClick={handleRemovePhoto} type="button">Remove photo</button>
          </div>
        </div>
      )}

      {showResetModal && (
        <div className="profile-modal-backdrop" onClick={() => setShowResetModal(false)}>
          <div aria-labelledby="profile-reset-title" aria-modal="true" className="profile-modal" onClick={(event) => event.stopPropagation()} role="dialog">
            <h3 id="profile-reset-title">Reset your profile?</h3>
            <p>This will erase your answers and recommendations. Your library will be kept.</p>
            <div className="profile-modal__actions">
              <button className="profile-modal__secondary" onClick={() => setShowResetModal(false)} type="button">Cancel</button>
              <button className="profile-modal__primary" onClick={handleReset} type="button">Reset profile</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
