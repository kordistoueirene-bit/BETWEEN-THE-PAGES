import { BookOpen, Compass, House, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const tabs = [
  { key: 'home', to: '/home', label: 'Home', Icon: House },
  { key: 'explore', to: '/explore', label: 'Explore', Icon: Compass },
  { key: 'library', to: '/library', label: 'Library', Icon: BookOpen },
  { key: 'profile', to: '/profile', label: 'Profile', Icon: UserRound },
];

export default function BottomNav({ activeTab = 'home' }) {
  return (
    <nav aria-label="Main navigation" className="bottom-nav">
      {tabs.map(({ key, to, label, Icon }) => {
        const isActive = activeTab === key;
        return (
          <NavLink
            aria-label={label}
            className={`bottom-nav__item${isActive ? ' is-active' : ''}`}
            key={to}
            to={to}
          >
            <Icon aria-hidden="true" size={21} strokeWidth={1.9} />
            <span>{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}