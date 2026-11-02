import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'btp-state-v1';

const initialState = {
  userProfile: null,
  library: {
    saved: [],
    reading: [],
    read: [],
    favorites: [],
    ratings: {},
    notForMe: [],
  },
  settings: {
    theme: 'light',
    spoilersDefault: 'hidden',
    notifications: true,
    readingLanguage: 'any',
    presets: [],
    hasSeenAppTour: false,
  },
  lastSearch: null,
  unreadNotifications: true,
};

const AppContext = createContext(null);

function loadState() {
  try {
    const storedState = window.localStorage.getItem(STORAGE_KEY);
    if (!storedState) return initialState;

    const parsedState = JSON.parse(storedState);
    return {
      ...initialState,
      ...parsedState,
      library: { ...initialState.library, ...parsedState.library },
      settings: { ...initialState.settings, ...parsedState.settings },
    };
  } catch {
    return initialState;
  }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage may be unavailable in restricted browser contexts.
    }
  }, [state]);

  const setUserProfile = (userProfile) => {
    setState((current) => ({ ...current, userProfile }));
  };

  const resetProfile = () => {
    setState((current) => ({ ...current, userProfile: null }));
  };

  const clearAllData = () => {
    setState(() => ({
      ...initialState,
      settings: { ...initialState.settings },
      library: { ...initialState.library },
      unreadNotifications: true,
    }));
  };

  const toggleInList = (listName, bookId) => {
    setState((current) => {
      const list = current.library[listName];
      if (!Array.isArray(list)) return current;

      const updatedList = list.includes(bookId)
        ? list.filter((id) => id !== bookId)
        : [...list, bookId];

      return {
        ...current,
        library: { ...current.library, [listName]: updatedList },
      };
    });
  };

  const rateBook = (id, stars) => {
    setState((current) => ({
      ...current,
      library: {
        ...current.library,
        ratings: { ...current.library.ratings, [id]: stars },
      },
    }));
  };

  const markNotForMe = (id) => {
    setState((current) => ({
      ...current,
      library: {
        ...current.library,
        notForMe: current.library.notForMe.includes(id)
          ? current.library.notForMe
          : [...current.library.notForMe, id],
      },
    }));
  };

  const updateSettings = (partial) => {
    setState((current) => ({
      ...current,
      settings: { ...current.settings, ...partial },
    }));
  };

  const setLastSearch = (lastSearch) => {
    setState((current) => ({ ...current, lastSearch }));
  };

  const markNotificationsAsRead = useCallback(() => {
    setState((current) => ({ ...current, unreadNotifications: false }));
  }, []);

  const value = {
    ...state,
    setUserProfile,
    resetProfile,
    clearAllData,
    toggleInList,
    rateBook,
    markNotForMe,
    updateSettings,
    setLastSearch,
    markNotificationsAsRead,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
