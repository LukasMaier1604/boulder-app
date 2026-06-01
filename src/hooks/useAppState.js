import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { achievementTemplates } from '../data/mockData';
import { api } from '../services/api';

const AppStateContext = createContext(null);
const avatarColors = ['#F58B1F', '#41C48B', '#5F8BFF', '#D96CFF', '#FF7E54'];

export const demoAccounts = [
  { id: 'demo-max', email: 'max@demo.de', password: 'demo1234', name: 'Max', avatarColor: '#F58B1F' },
  { id: 'demo-lisa', email: 'lisa@demo.de', password: 'demo1234', name: 'Lisa', avatarColor: '#41C48B' },
  { id: 'demo-tom', email: 'tom@demo.de', password: 'demo1234', name: 'Tom', avatarColor: '#5F8BFF' },
  { id: 'demo-anna', email: 'anna@demo.de', password: 'demo1234', name: 'Anna', avatarColor: '#D96CFF' },
];

const initialState = {
  currentUserId: null,
  sessionActive: false,
  sessionStartedAt: null,
  activeRouteId: null,
  users: [],
  routes: [],
  currentUserStats: null,
  loading: false,
  error: null,
};

function normalizeRoute(route) {
  const wallType = route.wallType
    ? route.wallType[0] + route.wallType.slice(1).toLowerCase()
    : '';

  return {
    ...route,
    wallType,
    betaSteps: route.betaSteps?.map((step) => step.text ?? step) ?? [],
  };
}

function normalizeClimbedRoute(entry) {
  return {
    routeId: entry.routeId,
    attempts: entry.attempts,
    topped: entry.topped,
    date: new Date(entry.date).toISOString().slice(0, 10),
    route: entry.route ? normalizeRoute(entry.route) : undefined,
  };
}

function normalizeUser(user, climbedRoutes = []) {
  return {
    ...user,
    sessionsCount: user.sessionsCount ?? user._count?.sessions ?? 0,
    climbedRoutes: climbedRoutes.map(normalizeClimbedRoute),
  };
}

function mergeUsers(users, user) {
  const existing = users.filter((entry) => entry.id !== user.id);
  return [...existing, user];
}

function reducer(state, action) {
  switch (action.type) {
    case 'REQUEST':
      return { ...state, loading: true, error: null };
    case 'FAILURE':
      return { ...state, loading: false, error: action.error };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        currentUserId: action.user.id,
        users: mergeUsers(state.users, action.user),
        sessionActive: action.sessionActive,
        sessionStartedAt: action.sessionStartedAt,
        loading: false,
        error: null,
      };
    case 'HYDRATE':
      return {
        ...state,
        users: action.users,
        routes: action.routes,
        currentUserStats: action.stats,
        loading: false,
        error: null,
      };
    case 'HYDRATE_FROM_STORAGE':
      return {
        ...state,
        isHydrated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        currentUserId: null,
        sessionActive: false,
        sessionStartedAt: null,
        activeRouteId: null,
        currentUserStats: null,
        error: null,
      };
    case 'SESSION_STARTED':
      return {
        ...state,
        sessionActive: true,
        sessionStartedAt: action.startedAt,
        users: mergeUsers(state.users, {
          ...action.user,
          sessionsCount: action.user.sessionsCount + 1,
        }),
      };
    case 'SESSION_STOPPED':
      return { ...state, sessionActive: false, sessionStartedAt: null, activeRouteId: null };
    case 'OPEN_ROUTE':
      return { ...state, activeRouteId: action.routeId };
    default:
      return state;
  }
}

function buildAchievements(user, routes) {
  const toppedRoutes = user.climbedRoutes.filter((entry) => entry.topped);
  const flashedRoutes = toppedRoutes.filter((entry) => entry.attempts <= 1);
  const uniqueGrades = new Set(
    user.climbedRoutes
      .map((entry) => {
        const route = entry.route ?? routes.find((item) => item.id === entry.routeId);
        return route?.grade;
      })
      .filter(Boolean),
  );
  const hardestTop = toppedRoutes.some((entry) => {
    const route = entry.route ?? routes.find((item) => item.id === entry.routeId);
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
  const [isHydrating, setIsHydrating] = useState(true);
  const tokenRef = useRef(null);

  // Restore token from AsyncStorage on app startup
  useEffect(() => {
    const hydrateToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('auth_token');
        if (storedToken) {
          tokenRef.current = storedToken;
          const meResult = await api.me(storedToken);
          const latestSession = meResult.user.sessions?.[0];
          const sessionActive = Boolean(latestSession && !latestSession.endedAt);
          const user = normalizeUser(meResult.user);

          dispatch({
            type: 'LOGIN_SUCCESS',
            user,
            sessionActive,
            sessionStartedAt: sessionActive ? latestSession.startedAt : null,
          });

          // Then refresh full dashboard
          await Promise.all([
            api.routes(storedToken),
            api.leaderboard(storedToken),
            api.stats(storedToken),
            api.climbed(storedToken),
          ]).then(([routesResult, leaderboardResult, statsResult, climbedResult]) => {
            const leaderboardUsers = (leaderboardResult.leaderboard ?? []).map((u) => ({
              ...u,
              climbedRoutes: [],
            }));
            const fullCurrentUser = {
              ...leaderboardUsers.find((u) => u.id === meResult.user.id),
              ...normalizeUser(meResult.user, climbedResult.climbedRoutes ?? []),
            };

            dispatch({
              type: 'HYDRATE',
              routes: (routesResult.routes ?? []).map(normalizeRoute),
              users: mergeUsers(leaderboardUsers, fullCurrentUser),
              stats: statsResult.stats,
            });
          });
        }
      } catch (error) {
        // Token invalid or expired - clear it
        await AsyncStorage.removeItem('auth_token');
        tokenRef.current = null;
      } finally {
        setIsHydrating(false);
      }
    };

    hydrateToken();
  }, []);

  const currentUser = useMemo(
    () => state.users.find((user) => user.id === state.currentUserId) ?? null,
    [state.currentUserId, state.users],
  );

  const refreshDashboard = useCallback(async (token) => {
    const [meResult, routesResult, leaderboardResult, statsResult, climbedResult] = await Promise.all([
      api.me(token),
      api.routes(token),
      api.leaderboard(token),
      api.stats(token),
      api.climbed(token),
    ]);

    const latestSession = meResult.user.sessions?.[0];
    const sessionActive = Boolean(latestSession && !latestSession.endedAt);
    const leaderboardUsers = (leaderboardResult.leaderboard ?? []).map((user) => ({
      ...user,
      climbedRoutes: [],
    }));
    const currentLeaderboardUser = leaderboardUsers.find((user) => user.id === meResult.user.id);
    const fullCurrentUser = {
      ...currentLeaderboardUser,
      ...normalizeUser(meResult.user, climbedResult.climbedRoutes ?? []),
    };

    dispatch({
      type: 'HYDRATE',
      routes: (routesResult.routes ?? []).map(normalizeRoute),
      users: mergeUsers(leaderboardUsers, fullCurrentUser),
      stats: statsResult.stats,
    });

    dispatch({
      type: 'LOGIN_SUCCESS',
      user: fullCurrentUser,
      sessionActive,
      sessionStartedAt: sessionActive ? latestSession.startedAt : null,
    });
  }, []);

  const finishAuth = useCallback(
    async (authResult) => {
      tokenRef.current = authResult.token;
      // Save token to AsyncStorage for persistence
      await AsyncStorage.setItem('auth_token', authResult.token);

      const meResult = await api.me(authResult.token);
      const latestSession = meResult.user.sessions?.[0];
      const sessionActive = Boolean(latestSession && !latestSession.endedAt);
      const user = normalizeUser(meResult.user);

      dispatch({
        type: 'LOGIN_SUCCESS',
        user,
        sessionActive,
        sessionStartedAt: sessionActive ? latestSession.startedAt : null,
      });

      await refreshDashboard(authResult.token);
    },
    [refreshDashboard],
  );

  const login = useCallback(
    async ({ email, password }) => {
      dispatch({ type: 'REQUEST' });

      try {
        const result = await api.login(email.trim(), password);
        await finishAuth(result);
      } catch (error) {
        dispatch({ type: 'FAILURE', error: error.message });
      }
    },
    [finishAuth],
  );

  const register = useCallback(
    async ({ name, email, password }) => {
      dispatch({ type: 'REQUEST' });

      try {
        const result = await api.register(name.trim(), email.trim(), password);
        await finishAuth(result);
      } catch (error) {
        dispatch({ type: 'FAILURE', error: error.message });
      }
    },
    [finishAuth],
  );

  const requireToken = useCallback(() => {
    if (!tokenRef.current) {
      throw new Error('Nicht eingeloggt');
    }

    return tokenRef.current;
  }, []);

  const runMutation = useCallback(
    async (mutation) => {
      if (!currentUser) {
        return;
      }

      try {
        const token = requireToken();
        await mutation(token);
        await refreshDashboard(token);
      } catch (error) {
        dispatch({ type: 'FAILURE', error: error.message });
      }
    },
    [currentUser, refreshDashboard, requireToken],
  );

  const currentRoute = useMemo(
    () => state.routes.find((route) => route.id === state.activeRouteId) ?? null,
    [state.activeRouteId, state.routes],
  );

  const leaderboard = useMemo(
    () =>
      [...state.users].sort(
        (left, right) => (right.score ?? 0) - (left.score ?? 0) || (left.totalAttempts ?? 0) - (right.totalAttempts ?? 0),
      ),
    [state.users],
  );

  const currentUserStats = useMemo(() => {
    if (!currentUser) {
      return null;
    }

    return (
      state.currentUserStats ?? {
        routesCount: 0,
        totalAttempts: 0,
        hardestRoute: null,
        completionRate: 0,
        progressToNextLevel: 0,
      }
    );
  }, [currentUser, state.currentUserStats]);

  const achievements = useMemo(
    () => (currentUser ? buildAchievements(currentUser, state.routes) : { weekly: [], milestone: [] }),
    [currentUser, state.routes],
  );

  const value = useMemo(
    () => ({
      demoAccounts,
      users: state.users,
      routes: state.routes,
      currentUser,
      currentRoute,
      leaderboard,
      achievements,
      currentUserStats,
      loading: state.loading,
      error: state.error,
      sessionActive: state.sessionActive,
      sessionStartedAt: state.sessionStartedAt,
      login,
      register,
      logout: async () => {
        tokenRef.current = null;
        await AsyncStorage.removeItem('auth_token');
        dispatch({ type: 'LOGOUT' });
      },
      startSession: async () => {
        if (!currentUser) {
          return;
        }

        try {
          const token = requireToken();
          const result = await api.startSession(token);
          dispatch({
            type: 'SESSION_STARTED',
            startedAt: result.session.startedAt,
            user: currentUser,
          });
          await refreshDashboard(token);
        } catch (error) {
          dispatch({ type: 'FAILURE', error: error.message });
        }
      },
      stopSession: async () => {
        await runMutation((token) => api.stopSession(token));
        dispatch({ type: 'SESSION_STOPPED' });
      },
      openRoute: (routeId) => dispatch({ type: 'OPEN_ROUTE', routeId }),
      updateName: (name) => runMutation((token) => api.updateProfile(token, { name })),
      cycleAvatar: () => {
        const currentIndex = avatarColors.indexOf(currentUser?.avatarColor);
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % avatarColors.length;
        return runMutation((token) =>
          api.updateProfile(token, { avatarColor: avatarColors[nextIndex] }),
        );
      },
      incrementAttempt: (routeId) => runMutation((token) => api.incrementAttempt(token, routeId)),
      resetAttempts: (routeId) => runMutation((token) => api.resetAttempts(token, routeId)),
      completeRoute: (routeId) => runMutation((token) => api.completeRoute(token, routeId)),
    }),
    [
      achievements,
      currentRoute,
      currentUser,
      currentUserStats,
      leaderboard,
      login,
      register,
      refreshDashboard,
      requireToken,
      runMutation,
      state.error,
      state.loading,
      state.routes,
      state.sessionActive,
      state.sessionStartedAt,
      state.users,
    ],
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
