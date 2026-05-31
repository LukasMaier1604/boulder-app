import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppScreen } from '../components/AppScreen';
import { AvatarBadge } from '../components/AvatarBadge';
import { SectionCard } from '../components/SectionCard';
import { useAppState } from '../hooks/useAppState';
import { theme } from '../data/theme';

export function UserDetailScreen({ route }) {
  const { userId } = route.params;
  const { users, routes } = useAppState();

  const user = useMemo(() => users.find((entry) => entry.id === userId), [userId, users]);

  if (!user) {
    return null;
  }

  return (
    <AppScreen>
      <SectionCard
        eyebrow="Athlet Profil"
        title={user.name}
        rightContent={<AvatarBadge color={user.avatarColor} name={user.name} />}
      >
        <Text style={styles.meta}>
          {user.level} - {user.sessionsCount} Sessions -{' '}
          {user.climbedRoutes.filter((entry) => entry.topped).length} Tops
        </Text>
      </SectionCard>

      <SectionCard eyebrow="Route History" title="Gekletterte Routen">
        <View style={styles.stack}>
          {user.climbedRoutes.map((entry) => {
            const routeData = routes.find((item) => item.id === entry.routeId);
            return (
              <View key={`${entry.routeId}-${entry.date}`} style={styles.historyRow}>
                <View style={styles.historyCopy}>
                  <Text style={styles.historyTitle}>
                    {routeData?.name ?? entry.routeId} - {routeData?.grade ?? '-'}
                  </Text>
                  <Text style={styles.historyMeta}>
                    {entry.attempts} Attempts - {entry.date} - {entry.topped ? 'Top' : 'Projekt'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  meta: {
    color: theme.colors.textMuted,
  },
  stack: {
    gap: theme.spacing.sm,
  },
  historyRow: {
    backgroundColor: theme.colors.cardSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  historyCopy: {
    gap: 6,
  },
  historyTitle: {
    color: theme.colors.text,
    fontWeight: '800',
    fontSize: 15,
  },
  historyMeta: {
    color: theme.colors.textMuted,
  },
});
