import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AchievementCard } from '../components/AchievementCard';
import { AppScreen } from '../components/AppScreen';
import { SectionCard } from '../components/SectionCard';
import { useAppState } from '../hooks/useAppState';
import { theme } from '../data/theme';

export function AchievementsScreen() {
  const { achievements } = useAppState();

  return (
    <AppScreen>
      <SectionCard eyebrow="Achievements" title="Woechentliche Ziele">
        <Text style={styles.copy}>Kurzfristige Motivation fuer die aktuelle Boulder-Woche.</Text>
        <View style={styles.stack}>
          {achievements.weekly.map((achievement) => (
            <AchievementCard achievement={achievement} key={achievement.id} />
          ))}
        </View>
      </SectionCard>

      <SectionCard eyebrow="Milestones" title="Langfristige Entwicklung">
        <Text style={styles.copy}>Meilensteine, die deine Fortschritte ueber mehrere Sessions sichtbar machen.</Text>
        <View style={styles.stack}>
          {achievements.milestone.map((achievement) => (
            <AchievementCard achievement={achievement} key={achievement.id} />
          ))}
        </View>
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  copy: {
    color: theme.colors.textMuted,
    lineHeight: 22,
  },
  stack: {
    gap: theme.spacing.sm,
  },
});

