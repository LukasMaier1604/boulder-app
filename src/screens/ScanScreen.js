import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppScreen } from '../components/AppScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionCard } from '../components/SectionCard';
import { useAppState } from '../hooks/useAppState';
import { theme } from '../data/theme';

export function ScanScreen({ navigation }) {
  const { routes, openRoute } = useAppState();
  const [hasPermission, setHasPermission] = useState(null);
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  // Request photo permission on mount
  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    requestPermission();
  }, []);

  const handleManualInput = () => {
    const routeId = manualInput.trim();

    if (!routeId) {
      Alert.alert('Fehler', 'Bitte geben Sie eine Route-ID ein.');
      return;
    }

    const route = routes.find((r) => r.id === routeId || r.id === parseInt(routeId, 10));

    if (!route) {
      Alert.alert('Route nicht gefunden', `Route ${routeId} existiert nicht.`);
      return;
    }

    openRoute(route.id);
    setManualInput('');
    setShowManualInput(false);
    navigation.navigate('RouteDetails');
  };

  const handleRandomRoute = () => {
    if (routes.length === 0) {
      Alert.alert('Fehler', 'Keine Routen verfügbar.');
      return;
    }

    // For development: pick random route to simulate scan
    const randomRoute = routes[Math.floor(Math.random() * routes.length)];
    openRoute(randomRoute.id);
    navigation.navigate('RouteDetails');
  };

  if (hasPermission === null) {
    return (
      <AppScreen contentStyle={styles.content}>
        <SectionCard eyebrow="Scan" title="Berechtigungen werden angefordert...">
          <ActivityIndicator color={theme.colors.accentSoft} size="large" />
        </SectionCard>
      </AppScreen>
    );
  }

  if (hasPermission === false) {
    return (
      <AppScreen contentStyle={styles.content}>
        <SectionCard eyebrow="Scan" title="Berechtigung erforderlich">
          <Text style={styles.copy}>
            Die App benötigt Zugriff auf deine Fotogalerie. Bitte aktiviere die Berechtigung in den Einstellungen.
          </Text>
          <PrimaryButton
            label="Manuelle Eingabe"
            onPress={() => setShowManualInput(true)}
            variant="secondary"
          />
        </SectionCard>
      </AppScreen>
    );
  }

  if (showManualInput) {
    return (
      <AppScreen contentStyle={styles.content}>
        <SectionCard eyebrow="Scan" title="Route manuell eingeben">
          <Text style={styles.helperText}>
            Verfügbare Route-IDs: {routes.map((r) => r.id).join(', ')}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Route-ID eingeben"
            value={manualInput}
            onChangeText={setManualInput}
            keyboardType="default"
            placeholderTextColor={theme.colors.textMuted}
          />
          <View style={styles.buttonGroup}>
            <PrimaryButton label="Laden" onPress={handleManualInput} />
            <PrimaryButton
              label="Abbrechen"
              onPress={() => {
                setShowManualInput(false);
                setManualInput('');
              }}
              variant="secondary"
            />
          </View>
        </SectionCard>
      </AppScreen>
    );
  }

  return (
    <AppScreen contentStyle={styles.content}>
      <SectionCard eyebrow="Scan" title="Route laden">
        <Text style={styles.copy}>
          Wähle eine Route zum Klettern. Nutze die Schnell-Option oder gib eine Route-ID manuell ein.
        </Text>

        <View style={styles.buttonGroup}>
          <PrimaryButton label="Zufällige Route (Dev)" onPress={handleRandomRoute} />
          <PrimaryButton
            label="Route-ID eingeben"
            onPress={() => setShowManualInput(true)}
            variant="secondary"
          />
        </View>

        <Text style={styles.footerText}>
          💡 Später: Hier kannst du dann QR-Codes scannen oder Fotos von QR-Codes hochladen.
        </Text>
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
    marginBottom: theme.spacing.md,
  },
  helperText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginBottom: theme.spacing.md,
    fontStyle: 'italic',
  },
  footerText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: theme.spacing.md,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
  },
  buttonGroup: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
});
