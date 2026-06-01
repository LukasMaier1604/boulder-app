import React, { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { AppScreen } from '../components/AppScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionCard } from '../components/SectionCard';
import { useAppState } from '../hooks/useAppState';
import { useMockScan } from '../hooks/useMockScan';
import { theme } from '../data/theme';

export function ScanLoadingScreen({ navigation }) {
  const { routes, openRoute } = useAppState();

  const handleResolved = useCallback(
    (route) => {
      openRoute(route.id);
      navigation.replace('RouteDetails');
    },
    [navigation, openRoute],
  );

  const { selectedRoute } = useMockScan(handleResolved);

  const handleManualLoad = () => {
    if (!selectedRoute && !routes.length) {
      return;
    }

    openRoute(selectedRoute?.id ?? routes[0].id);
    navigation.replace('RouteDetails');
  };

  return (
    <AppScreen contentStyle={styles.content} scroll={false}>
      <SectionCard eyebrow="Scanner" title="Suche nach Route...">
        <View style={styles.loaderWrap}>
          <ActivityIndicator color={theme.colors.accentSoft} size="large" />
          <Text style={styles.copy}>NFC-Tag wird simuliert. Bitte kurz warten.</Text>
        </View>
        <PrimaryButton
          disabled={!selectedRoute && !routes.length}
          label="Route manuell laden"
          onPress={handleManualLoad}
          variant="secondary"
        />
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
  loaderWrap: {
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  copy: {
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
