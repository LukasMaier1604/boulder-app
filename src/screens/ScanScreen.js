import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppScreen } from '../components/AppScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionCard } from '../components/SectionCard';
import { useAppState } from '../hooks/useAppState';
import { theme } from '../data/theme';

export function ScanScreen({ navigation }) {
  const { routes, openRoute } = useAppState();

  const handleManualLoad = () => {
    if (!routes.length) {
      return;
    }

    openRoute(routes[0].id);
    navigation.navigate('RouteDetails');
  };

  return (
    <AppScreen contentStyle={styles.content}>
      <SectionCard eyebrow="Scan" title="Fake NFC Scan">
        <Text style={styles.copy}>
          Starte den simulierten NFC-Scan. Danach erscheint bewusst ein Scanner-/Loader-Screen mit kleiner Verzoegerung.
        </Text>
        <PrimaryButton
          disabled={!routes.length}
          label="Route scannen"
          onPress={() => navigation.navigate('ScanLoading')}
        />
        <PrimaryButton
          disabled={!routes.length}
          label="Route manuell laden"
          onPress={handleManualLoad}
          variant="ghost"
        />
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
  copy: {
    color: theme.colors.textMuted,
    lineHeight: 22,
  },
});
