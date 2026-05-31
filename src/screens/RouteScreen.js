import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppScreen } from '../components/AppScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionCard } from '../components/SectionCard';
import { StatChip } from '../components/StatChip';
import { useAppState } from '../hooks/useAppState';
import { theme } from '../data/theme';

export function RouteScreen() {
  const { currentRoute, currentUser, incrementAttempt, resetAttempts, completeRoute } = useAppState();
  const [showBeta, setShowBeta] = useState(false);
  const [betaIndex, setBetaIndex] = useState(0);

  const routeEntry = useMemo(
    () => currentUser?.climbedRoutes.find((entry) => entry.routeId === currentRoute?.id),
    [currentRoute?.id, currentUser?.climbedRoutes],
  );

  if (!currentRoute || !currentUser) {
    return null;
  }

  return (
    <AppScreen>
      <SectionCard eyebrow="Route" title={currentRoute.name}>
        <Text style={styles.description}>{currentRoute.description}</Text>
        <View style={styles.chipRow}>
          <StatChip label="Grad" value={currentRoute.grade} />
          <StatChip label="Wand" value={currentRoute.wallType} />
          <StatChip label="Bereich" value={currentRoute.location} />
        </View>
      </SectionCard>

      <SectionCard eyebrow="Attempt Tracking" title="Versuche verwalten">
        <View style={styles.chipRow}>
          <StatChip label="Versuche" value={routeEntry?.attempts ?? 0} />
          <StatChip label="Status" value={routeEntry?.topped ? 'Top' : 'Offen'} />
        </View>
        <View style={styles.buttonRow}>
          <View style={styles.buttonFill}>
            <PrimaryButton label="+ Versuch" onPress={() => incrementAttempt(currentRoute.id)} />
          </View>
          <View style={styles.buttonFill}>
            <PrimaryButton label="Reset" onPress={() => resetAttempts(currentRoute.id)} variant="secondary" />
          </View>
        </View>
        <PrimaryButton label="Route geschafft" onPress={() => completeRoute(currentRoute.id)} variant="ghost" />
      </SectionCard>

      <SectionCard eyebrow="Beta Feature" title="Tipps zur Route">
        <PrimaryButton
          label={showBeta ? 'Beta ausblenden' : 'Beta anzeigen'}
          onPress={() => setShowBeta((current) => !current)}
          variant="secondary"
        />
        {showBeta ? (
          <View style={styles.betaCard}>
            <Text style={styles.betaStep}>
              Schritt {betaIndex + 1} / {currentRoute.betaSteps.length}
            </Text>
            <Text style={styles.betaText}>{currentRoute.betaSteps[betaIndex]}</Text>
            <View style={styles.betaDots}>
              {currentRoute.betaSteps.map((step, index) => (
                <Pressable
                  key={step}
                  onPress={() => setBetaIndex(index)}
                  style={[styles.dot, index === betaIndex && styles.dotActive]}
                />
              ))}
            </View>
            <View style={styles.buttonRow}>
              <View style={styles.buttonFill}>
                <PrimaryButton
                  label="Zurueck"
                  onPress={() =>
                    setBetaIndex((current) =>
                      current === 0 ? currentRoute.betaSteps.length - 1 : current - 1,
                    )
                  }
                  variant="secondary"
                />
              </View>
              <View style={styles.buttonFill}>
                <PrimaryButton
                  label="Weiter"
                  onPress={() =>
                    setBetaIndex((current) => (current + 1) % currentRoute.betaSteps.length)
                  }
                />
              </View>
            </View>
          </View>
        ) : null}
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  description: {
    color: theme.colors.textMuted,
    lineHeight: 22,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  buttonFill: {
    flex: 1,
  },
  betaCard: {
    backgroundColor: theme.colors.cardSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  betaStep: {
    color: theme.colors.accentSoft,
    textTransform: 'uppercase',
    fontWeight: '700',
    fontSize: 12,
  },
  betaText: {
    color: theme.colors.text,
    lineHeight: 22,
  },
  betaDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
  },
  dotActive: {
    backgroundColor: theme.colors.accent,
  },
});

