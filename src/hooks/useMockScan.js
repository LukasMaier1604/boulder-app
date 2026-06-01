import { useEffect, useMemo } from 'react';
import { useAppState } from './useAppState';

export function useMockScan(onResolved) {
  const { routes } = useAppState();

  const selectedRoute = useMemo(() => {
    if (!routes.length) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * routes.length);
    return routes[randomIndex];
  }, [routes]);

  useEffect(() => {
    if (!selectedRoute) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      onResolved(selectedRoute);
    }, 2500);

    return () => clearTimeout(timeout);
  }, [onResolved, selectedRoute]);

  return {
    selectedRoute,
  };
}
