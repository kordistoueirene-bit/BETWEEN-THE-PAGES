import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BOOKS } from '../data/index.js';
import { useAppContext } from '../context/AppContext.jsx';
import './NotificationsScreen.css';

function getNotifications() {
  const trending = BOOKS.filter((book) => book.timely.trendingScore >= 75)[0];
  const comingSoon = BOOKS.find((book) => book.timely.adaptation?.when === 'Coming soon');
  const newRelease = BOOKS.find((book) => book.timely.isNewRelease);
  const seasonal = BOOKS.find((book) => book.timely.seasonal === 'autumn');
  const favorite = BOOKS.find((book) => book.genres.includes('Contemporary'));

  return [
    { id: trending?.id || 'book-1', message: `🔥 ${trending?.title || 'A trending favorite'} is trending this week` },
    { id: comingSoon?.id || 'book-2', message: `🎬 ${comingSoon?.title || 'A book'} is coming to screen soon` },
    { id: newRelease?.id || 'book-3', message: `📚 New release you might like: ${newRelease?.title || 'A new favorite'}` },
    { id: seasonal?.id || 'book-4', message: `🍂 Seasonal pick for you: ${seasonal?.title || 'A cozy read'}` },
    { id: favorite?.id || 'book-5', message: `✨ Readers like you are loving ${favorite?.title || 'A story worth your time'}` },
  ];
}

export default function NotificationsScreen() {
  const navigate = useNavigate();
  const { markNotificationsAsRead } = useAppContext();

  useEffect(() => {
    markNotificationsAsRead();
  }, [markNotificationsAsRead]);

  const notifications = getNotifications();

  return (
    <main className="notifications-screen">
      <header className="notifications-header">
        <Link aria-label="Back to home" className="notifications-header__back" to="/home">
          <ArrowLeft aria-hidden="true" size={20} />
        </Link>
        <h1>Notifications</h1>
        <span aria-hidden="true" className="notifications-header__spacer" />
      </header>

      <div className="notifications-list">
        {notifications.map((item) => (
          <button className="notifications-item" key={item.id} onClick={() => navigate(`/book/${item.id}`, { state: { from: 'notifications', fromTab: 'home' } })} type="button">
            <span className="notifications-item__dot" aria-hidden="true" />
            <span>{item.message}</span>
          </button>
        ))}
      </div>
    </main>
  );
}
