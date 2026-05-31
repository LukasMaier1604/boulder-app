import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppScreen } from '../components/AppScreen';
import { AvatarBadge } from '../components/AvatarBadge';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionCard } from '../components/SectionCard';
import { useAppState } from '../hooks/useAppState';
import { theme } from '../data/theme';

export function LoginScreen() {
  const { users, login } = useAppState();
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id ?? null);
  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? users[0],
    [selectedUserId, users],
  );

  return (
    <AppScreen>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Kletterwerk Radolfzell</Text>
        <Text style={styles.title}>Mockup Mobile App fuer realistischen Boulder-Flow</Text>
        <Text style={styles.subtitle}>
          Login ist nur simuliert. Danach startet die User Journey erst bewusst ueber den Session-Start.
        </Text>
      </View>

      <SectionCard eyebrow="Mock Login" title="User auswaehlen">
        <View style={styles.userList}>
          {users.map((user) => {
            const selected = user.id === selectedUserId;

            return (
              <Pressable
                key={user.id}
                onPress={() => setSelectedUserId(user.id)}
                style={[styles.userCard, selected && styles.userCardSelected]}
              >
                <AvatarBadge color={user.avatarColor} name={user.name} />
                <View style={styles.userCopy}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userMeta}>
                    {user.level} - {user.sessionsCount} Sessions
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
        <PrimaryButton
          label={`Login als ${selectedUser?.name ?? 'User'}`}
          onPress={() => login(selectedUserId)}
        />
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 10,
    paddingTop: 8,
  },
  kicker: {
    color: theme.colors.accentSoft,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    fontWeight: '800',
  },
  title: {
    color: theme.colors.text,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  userList: {
    gap: theme.spacing.sm,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.cardSoft,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  userCardSelected: {
    borderColor: theme.colors.accent,
  },
  userCopy: {
    gap: 4,
  },
  userName: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  userMeta: {
    color: theme.colors.textMuted,
  },
});
