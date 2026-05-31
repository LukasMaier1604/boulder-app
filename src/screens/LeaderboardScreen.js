import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppScreen } from '../components/AppScreen';
import { SectionCard } from '../components/SectionCard';
import { UserRow } from '../components/UserRow';
import { useAppState } from '../hooks/useAppState';
import { theme } from '../data/theme';

export function LeaderboardScreen({ navigation }) {
  const { leaderboard } = useAppState();

  return (
    <AppScreen>
      <SectionCard eyebrow="Leaderboard" title="Ranking der Halle">
        <Text style={styles.copy}>
          Score basiert auf geschafften Routen und Schwierigkeitswerten. Tippe auf einen User fuer Details.
        </Text>
        <View style={styles.list}>
          {leaderboard.map((user, index) => (
            <UserRow
              key={user.id}
              onPress={() => navigation.navigate('UserDetail', { userId: user.id })}
              subtitle={`#${index + 1} · ${user.toppedCount} Tops · ${user.totalAttempts} Attempts · ${user.score} Punkte`}
              user={user}
            />
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
  list: {
    gap: theme.spacing.sm,
  },
});

