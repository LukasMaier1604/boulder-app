import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { achievementTemplates, routes, users } from '../data/mockData';

const AppStateContext = createContext(null);
const avatarColors = ['#F58B1F', '#41C48B', '#5F8BFF', '#D96CFF', '#FF7E54'];

const initialState = {
  currentUserId: null,
  sessionActive: false,
  sessionStartedAt: null,
  activeRouteId: null,
  users,
};

function updateCurrentUser(state, updater) {
  return {
    ...state,
    users: state.users.map((user) =>
      user.id === state.currentUserId ? updater(user) : user
    ),
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUserId: action.userId, sessionActive: false, activeRouteId: null };
    case 'LOGOUT':
      return { ...state, currentUserId: null, sessionActive: false, sessionStartedAt: null, activeRouteId: null };
    case 'START_SESSION':
      return updateCurrentUser(
        {
          ...state,
          sessionActive: true,
          sessionStartedAt: new Date().toISOString(),
        },
        (user) => ({ ...user, sessionsCount: user.sessionsCount + 1 }),
      );
    case 'STOP_SESSION':
      return { ...state, sessionActive: false, sessionStartedAt: null, activeRouteId: null };
    case 'OPEN_ROUTE':
      return { ...state, activeRouteId: action.routeId };
    case 'UPDATE_NAME':
      return updateCurrentUser(state, (user) => ({ ...user, name: action.name || user.name }));
    case 'CYCLE_AVATAR':
      return updateCurrentUser(state, (user) => {
        const currentIndex = avatarColors.indexOf(user.avatarColor);
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % avatarColors.length;
        return { ...user, avatarColor: avatarColors[nextIndex] };
      });
    case 'INCREMENT_ATTEMPT':
      return updateCurrentUser(state, (user) => {
        const existingEntry = user.climbedRoutes.find((entry) => entry.routeId === action.routeId);
        const nextRoutes = existingEntry
          ? user.climbedRoutes.map((entry) =>
              entry.routeId === action.routeId
                ? { ...entry, attempts: entry.attempts + 1 }
                : entry,
            )
          : [
              ...user.climbedRoutes,
              { routeId: action.routeId, attempts: 1, date: new Date().toISOString().slice(0, 10), topped: false },
            ];

        return { ...user, climbedRoutes: nextRoutes };
      });
    case 'RESET_ATTEMPTS':
      return updateCurrentUser(state, (user) => ({
        ...user,
        climbedRoutes: user.climbedRoutes.map((entry) =>
          entry.routeId === action.routeId ? { ...entry, attempts: 0 } : entry,
        ),
      }));
    case 'COMPLETE_ROUTE':
      return updateCurrentUser(state, (user) => {
        const existingEntry = user.climbedRoutes.find((entry) => entry.routeId === action.routeId);
        const nextRoutes = existingEntry
          ? user.climbedRoutes.map((entry) =>
              entry.routeId === action.routeId
                ? { ...entry, topped: true, date: new Date().toISOString().slice(0, 10) }
                : entry,
            )
          : [
              ...user.climbedRoutes,
              { routeId: action.routeId, attempts: 0, date: new Date().toISOString().slice(0, 10), topped: true },
            ];

        return { ...user, climbedRoutes: nextRoutes };
      });
    default:
      return state;
  }
}

function buildAchievements(user) {
  const toppedRoutes = user.climbedRoutes.filter((entry) => entry.topped);
  const flashedRoutes = toppedRoutes.filter((entry) => entry.attempts <= 1);
  const uniqueGrades = new Set(
    user.climbedRoutes
      .map((entry) => routes.find((route) => route.id === entry.routeId)?.grade)
      .filter(Boolean),
  );
  const hardestTop = toppedRoutes.some((entry) => {
    const route = routes.find((item) => item.id === entry.routeId);
    return route && route.gradeValue >= 5;
  });

  return {
    weekly: achievementTemplates.weekly.map((item) => {
      const progressMap = {
        'weekly-routes': toppedRoutes.length,
        'weekly-flash': flashedRoutes.length,
        'weekly-grades': uniqueGrades.size,
      };
      const progress = progressMap[item.id] ?? 0;
      return { ...item, type: 'weekly', progress, completed: progress >= item.goal };
    }),
    milestone: achievementTemplates.milestone.map((item) => {
      const progressMap = {
        'milestone-50': toppedRoutes.length,
        'milestone-v5': hardestTop ? 1 : 0,
        'milestone-sessions': user.sessionsCount,
      };
      const progress = progressMap[item.id] ?? 0;
      return { ...item, type: 'milestone', progress, completed: progress >= item.goal };
    }),
  };
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const currentUser = useMemo(
    () => state.users.find((user) => user.id === state.currentUserId) ?? null,
    [state.currentUserId, state.users],
  );

  const currentRoute = useMemo(
    () => routes.find((route) => route.id === state.activeRouteId) ?? null,
    [state.activeRouteId],
  );

  const leaderboard = useMemo(() => {
    return state.users
      .map((user) => {
        const toppedRoutes = user.climbedRoutes.filter((entry) => entry.topped);
        const totalAttempts = user.climbedRoutes.reduce((sum, entry) => sum + entry.attempts, 0);
        const score = toppedRoutes.reduce((sum, entry) => {
          const route = routes.find((item) => item.id === entry.routeId);
          return sum + (route?.gradeValue ?? 1) * 100;
        }, 0);

        return {
          ...user,
          toppedCount: toppedRoutes.length,
          totalAttempts,
          score,
        };
      })
      .sort((left, right) => right.score - left.score || left.totalAttempts - right.totalAttempts);
  }, [state.users]);

  const currentUserStats = useMemo(() => {
    if (!currentUser) {
      return null;
    }

    const toppedRoutes = currentUser.climbedRoutes.filter((entry) => entry.topped);
    const totalAttempts = currentUser.climbedRoutes.reduce((sum, entry) => sum + entry.attempts, 0);
    const hardestRoute = toppedRoutes.reduce((hardest, entry) => {
      const route = routes.find((item) => item.id === entry.routeId);
      if (!route) {
        return hardest;
      }
      return !hardest || route.gradeValue > hardest.gradeValue ? route : hardest;
    }, null);

    return {
      routesCount: toppedRoutes.length,
      totalAttempts,
      hardestRoute,
      completionRate: totalAttempts ? Math.round((toppedRoutes.length / totalAttempts) * 100) : 0,
      progressToNextLevel: Math.min(100, toppedRoutes.length * 12),
    };
  }, [currentUser]);

  const achievements = useMemo(
    () => (currentUser ? buildAchievements(currentUser) : { weekly: [], milestone: [] }),
    [currentUser],
  );

  const value = useMemo(
    () => ({
      users: state.users,
      routes,
      currentUser,
      currentRoute,
      leaderboard,
      achievements,
      currentUserStats,
      sessionActive: state.sessionActive,
      sessionStartedAt: state.sessionStartedAt,
      login: (userId) => dispatch({ type: 'LOGIN', userId }),
      logout: () => dispatch({ type: 'LOGOUT' }),
      startSession: () => dispatch({ type: 'START_SESSION' }),
      stopSession: () => dispatch({ type: 'STOP_SESSION' }),
      openRoute: (routeId) => dispatch({ type: 'OPEN_ROUTE', routeId }),
      updateName: (name) => dispatch({ type: 'UPDATE_NAME', name }),
      cycleAvatar: () => dispatch({ type: 'CYCLE_AVATAR' }),
      incrementAttempt: (routeId) => dispatch({ type: 'INCREMENT_ATTEMPT', routeId }),
      resetAttempts: (routeId) => dispatch({ type: 'RESET_ATTEMPTS', routeId }),
      completeRoute: (routeId) => dispatch({ type: 'COMPLETE_ROUTE', routeId }),
    }),
    [achievements, currentRoute, currentUser, currentUserStats, leaderboard, state.sessionActive, state.sessionStartedAt, state.users],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error('useAppState must be used inside AppProvider');
  }

  return context;
}

