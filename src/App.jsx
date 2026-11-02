import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav.jsx';
import PhoneFrame from './components/PhoneFrame.jsx';
import { useAppContext } from './context/AppContext.jsx';
import BookDetailsScreen from './screens/BookDetailsScreen.jsx';
import CollectionScreen from './screens/CollectionScreen.jsx';
import DebugScreen from './screens/DebugScreen.jsx';
import ExploreScreen from './screens/ExploreScreen.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import LibraryScreen from './screens/LibraryScreen.jsx';
import MoodFinderScreen from './screens/MoodFinderScreen.jsx';
import NotificationsScreen from './screens/NotificationsScreen.jsx';
import OnboardingScreen from './screens/OnboardingScreen.jsx';
import PlaceholderScreen from './screens/PlaceholderScreen.jsx';
import ProfileEditScreen from './screens/ProfileEditScreen.jsx';
import ProfileQuizScreen from './screens/ProfileQuizScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import ResultsScreen from './screens/ResultsScreen.jsx';
import SettingsScreen from './screens/SettingsScreen.jsx';
import WelcomeScreen from './screens/WelcomeScreen.jsx';

const screens = [
  { path: '/', name: 'Welcome' },
  { path: '/onboarding', name: 'Onboarding' },
  { path: '/home', name: 'Home' },
  { path: '/explore', name: 'Explore' },
  { path: '/mood', name: 'Mood Finder' },
  { path: '/results', name: 'Results' },
  { path: '/collection/:key', name: 'Collection' },
  { path: '/notifications', name: 'Notifications' },
  { path: '/book/:id', name: 'Book Details' },
  { path: '/library', name: 'My Library' },
  { path: '/profile', name: 'Profile' },
  { path: '/profile/edit', name: 'Edit Profile' },
  { path: '/profile/quiz', name: 'Quick Quiz' },
  { path: '/settings', name: 'Settings' },
];

const navigationPaths = [
  { path: '/', name: 'Welcome' },
  { path: '/onboarding', name: 'Onboarding' },
  { path: '/home', name: 'Home' },
  { path: '/explore', name: 'Explore' },
  { path: '/mood', name: 'Mood Finder' },
  { path: '/results', name: 'Results' },
  { path: '/collection/demo', name: 'Collection' },
  { path: '/notifications', name: 'Notifications' },
  { path: '/book/demo', name: 'Book Details' },
  { path: '/library', name: 'My Library' },
  { path: '/profile', name: 'Profile' },
  { path: '/profile/edit', name: 'Edit Profile' },
  { path: '/profile/quiz', name: 'Quick Quiz' },
  { path: '/settings', name: 'Settings' },
];

function getActiveTab(pathname, routeState = {}) {
  const explicitTab = routeState?.fromTab || routeState?.tab || routeState?.origin;
  if (['home', 'explore', 'library', 'profile'].includes(explicitTab)) {
    return explicitTab;
  }

  if (['/home', '/mood', '/results', '/notifications'].includes(pathname)) return 'home';
  if (pathname === '/explore') return 'explore';
  if (pathname === '/library') return 'library';
  if (pathname === '/profile' || pathname.startsWith('/profile/')) return 'profile';
  if (pathname === '/settings') return 'profile';
  if (pathname.startsWith('/collection/')) return 'home';
  if (pathname.startsWith('/book/')) return routeState?.fromTab || 'home';

  return 'home';
}

function AppLayout() {
  const location = useLocation();
  const { pathname, state } = location;
  const { settings } = useAppContext();
  const showBottomNav = !['/', '/onboarding'].includes(pathname);
  const activeTab = getActiveTab(pathname, state);

  return (
    <PhoneFrame theme={settings.theme}>
      <div className="app-layout">
        <Routes key={pathname}>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/explore" element={<ExploreScreen />} />
          <Route path="/library" element={<LibraryScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/profile/edit" element={<ProfileEditScreen />} />
          <Route path="/profile/quiz" element={<ProfileQuizScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/mood" element={<MoodFinderScreen />} />
          <Route path="/results" element={<ResultsScreen />} />
          <Route path="/collection/:key" element={<CollectionScreen />} />
          <Route path="/notifications" element={<NotificationsScreen />} />
          <Route path="/book/:id" element={<BookDetailsScreen />} />
          <Route path="/debug" element={<DebugScreen />} />
          {screens.filter(({ path }) => !['/', '/onboarding', '/home', '/explore', '/library', '/profile', '/profile/edit', '/profile/quiz', '/settings', '/mood', '/results', '/collection/:key', '/notifications', '/book/:id'].includes(path)).map(({ path, name }) => (
            <Route
              key={path}
              path={path}
              element={<PlaceholderScreen name={name} navigationPaths={navigationPaths} />}
            />
          ))}
        </Routes>
        {showBottomNav && <BottomNav activeTab={activeTab} />}
      </div>
    </PhoneFrame>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppLayout />
    </HashRouter>
  );
}