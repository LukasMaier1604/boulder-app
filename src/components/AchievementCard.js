import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../data/theme';

export function AchievementCard({ achievement }) {
  const progressWidth = `${Math.min(100, (achievement.progress / achievement.goal) * 100)}%`;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{achievement.title}</Text>
        <Text style={[styles.badge, achievement.completed && styles.badgeDone]}>
          {achievement.completed ? 'completed' : achievement.type}
        </Text>
      </View>
      <Text style={styles.progressText}>
        {achievement.progress} / {achievement.goal}
      </Text>
      <View style={styles.bar}>
        <View style={[styles.fill, { width: progressWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.cardSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  title: {
    flex: 1,
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  badge: {
    color: theme.colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  badgeDone: {
    color: theme.colors.success,
  },
  progressText: {
    color: theme.colors.textMuted,
  },
  bar: {
    height: 10,
    backgroundColor: '#111315',
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: theme.colors.accent,
    borderRadius: 999,
  },
});

