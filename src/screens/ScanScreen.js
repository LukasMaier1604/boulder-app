import * as ImagePicker from 'expo-image-picker';
import jsqr from 'jsqr';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppScreen } from '../components/AppScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionCard } from '../components/SectionCard';
import { useAppState } from '../hooks/useAppState';
import { theme } from '../data/theme';

export function ScanScreen({ navigation }) {
  const { routes, openRoute } = useAppState();
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQRScanned = (qrText) => {
    const routeId = qrText.trim();

    if (!routeId) {
      Alert.alert('Fehler', 'QR-Code konnte nicht gelesen werden.');
      return;
    }

    const route = routes.find((r) => r.id === routeId || r.id === parseInt(routeId, 10));

    if (!route) {
      Alert.alert('Route nicht gefunden', `Route "${routeId}" existiert nicht.`);
      return;
    }

    openRoute(route.id);
    navigation.navigate('RouteDetails');
  };

  const handleManualInput = () => {
    handleQRScanned(manualInput);
    if (routes.find((r) => r.id === manualInput.trim() || r.id === parseInt(manualInput.trim(), 10))) {
      setManualInput('');
      setShowManualInput(false);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setIsProcessing(true);
      try {
        const imageUri = result.assets[0].uri;
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onload = () => {
          const data = new Uint8ClampedArray(reader.result);
          const code = jsqr(data, result.assets[0].width || 1000, result.assets[0].height || 1000);
          setIsProcessing(false);

          if (code) {
            handleQRScanned(code.data);
          } else {
            Alert.alert('Fehler', 'Kein QR-Code im Bild gefunden. Versuche es erneut.');
          }
        };

        reader.readAsArrayBuffer(blob);
      } catch (error) {
        setIsProcessing(false);
        Alert.alert('Fehler', 'Bild konnte nicht verarbeitet werden.');
        console.error(error);
      }
    }
  };

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
          Scanne einen QR-Code einer Route oder gib eine Route-ID manuell ein.
        </Text>

        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator color={theme.colors.accent} size="large" />
            <Text style={styles.processingText}>QR-Code wird erkannt...</Text>
          </View>
        )}

        <View style={styles.buttonGroup}>
          <PrimaryButton label="🖼️ QR-Code aus Galerie" onPress={handlePickImage} disabled={isProcessing} />
          <PrimaryButton
            label="🔢 Route-ID eingeben"
            onPress={() => setShowManualInput(true)}
            variant="secondary"
            disabled={isProcessing}
          />
        </View>
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
  processingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  processingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textMuted,
    fontSize: 14,
  },
});
