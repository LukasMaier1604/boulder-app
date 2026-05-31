import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppScreen } from '../components/AppScreen';
import { AvatarBadge } from '../components/AvatarBadge';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionCard } from '../components/SectionCard';
import { StatChip } from '../components/StatChip';
import { useAppState } from '../hooks/useAppState';
import { theme } from '../data/theme';

export function HomeScreen({ navigation }) {
  const { currentUser, currentUserStats, sessionStartedAt, stopSession } = useAppState();

  const sessionLabel = useMemo(() => {
    if (!sessionStartedAt) {
      return 'Session aktiv';
    }

    return `Start ${new Date(sessionStartedAt).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  }, [sessionStartedAt]);

  return (
    <AppScreen>
      <SectionCard
        eyebrow="Home / Session"
        title={`Willkommen, ${currentUser.name}`}
        rightContent={<AvatarBadge color={currentUser.avatarColor} name={currentUser.name} />}
      >
        <Text style={styles.copy}>
          Deine Session laeuft. Von hier aus kannst du scannen, den Fortschritt checken oder die Session bewusst beenden.
        </Text>
        <View style={styles.chipRow}>
          <StatChip label="Status" value={sessionLabel} />
          <StatChip label="Level" value={currentUser.level} />
        </View>
        <View style={styles.chipRow}>
          <StatChip label="Routen" value={currentUserStats.routesCount} />
          <StatChip label="Attempts" value={currentUserStats.totalAttempts} />
          <StatChip
            label="Hardest"
            value={currentUserStats.hardestRoute ? currentUserStats.hardestRoute.grade : '-'}
          />
        </View>
        <PrimaryButton label="Zum Scan" onPress={() => navigation.navigate('Scan')} />
      </SectionCard>

      <SectionCard eyebrow="Progress" title="Aktueller Session-Stand">
        <Text style={styles.progressLabel}>Erfolgsquote</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.max(6, currentUserStats.completionRate)}%` },
            ]}
          />
        </View>
        <Text style={styles.progressValue}>{currentUserStats.completionRate}% Tops pro Attempt</Text>
        <PrimaryButton label="Session beenden" onPress={stopSession} variant="secondary" />
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  copy: {
    color: theme.colors.textMuted,
    lineHeight: 22,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  progressLabel: {
    color: theme.colors.text,
    fontWeight: '700',
  },
  progressBar: {
    height: 12,
    borderRadius: 999,
    backgroundColor: theme.colors.cardSoft,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
    borderRadius: 999,
  },
  progressValue: {
    color: theme.colors.textMuted,
  },
});

