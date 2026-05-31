import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppScreen } from '../components/AppScreen';
import { AvatarBadge } from '../components/AvatarBadge';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionCard } from '../components/SectionCard';
import { useAppState } from '../hooks/useAppState';
import { theme } from '../data/theme';

export function SessionStartScreen() {
  const { currentUser, startSession, logout } = useAppState();

  return (
    <AppScreen contentStyle={styles.content} scroll={false}>
      <SectionCard eyebrow="Session Flow" title="Bereit fuer die naechste Session?">
        <View style={styles.profile}>
          <AvatarBadge color={currentUser.avatarColor} name={currentUser.name} size={72} />
          <View style={styles.profileCopy}>
            <Text style={styles.name}>{currentUser.name}</Text>
            <Text style={styles.meta}>{currentUser.level}</Text>
          </View>
        </View>

        <Text style={styles.description}>
          Solange keine Session aktiv ist, bleibt die App bewusst in diesem Startpunkt. Erst danach
          werden Scan, Leaderboard, Achievements und Profil freigeschaltet.
        </Text>

        <PrimaryButton label="Session starten" onPress={startSession} />
        <PrimaryButton label="Logout" onPress={logout} variant="ghost" />
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  profileCopy: {
    gap: 6,
  },
  name: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  meta: {
    color: theme.colors.textMuted,
    fontSize: 15,
  },
  description: {
    color: theme.colors.textMuted,
    lineHeight: 22,
  },
});

