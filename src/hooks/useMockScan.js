import { useEffect, useMemo } from 'react';
import { useAppState } from './useAppState';

export function useMockScan(onResolved) {
  const { routes } = useAppState();

  const selectedRoute = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * routes.length);
    return routes[randomIndex];
  }, [routes]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onResolved(selectedRoute);
    }, 2500);

    return () => clearTimeout(timeout);
  }, [onResolved, selectedRoute]);

  return {
    selectedRoute,
  };
}
