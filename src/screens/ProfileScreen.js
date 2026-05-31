import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { AppScreen } from '../components/AppScreen';
import { AvatarBadge } from '../components/AvatarBadge';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionCard } from '../components/SectionCard';
import { StatChip } from '../components/StatChip';
import { useAppState } from '../hooks/useAppState';
import { theme } from '../data/theme';

export function ProfileScreen() {
  const { currentUser, currentUserStats, updateName, cycleAvatar, logout } = useAppState();
  const [draftName, setDraftName] = useState(currentUser.name);

  return (
    <AppScreen>
      <SectionCard eyebrow="Profil" title="Dein Boulder-Profil">
        <View style={styles.header}>
          <AvatarBadge color={currentUser.avatarColor} name={currentUser.name} size={72} />
          <View style={styles.headerCopy}>
            <Text style={styles.name}>{currentUser.name}</Text>
            <Text style={styles.level}>{currentUser.level}</Text>
          </View>
        </View>

        <TextInput
          onChangeText={setDraftName}
          placeholder="Name anpassen"
          placeholderTextColor={theme.colors.textMuted}
          style={styles.input}
          value={draftName}
        />

        <View style={styles.buttonRow}>
          <View style={styles.buttonFill}>
            <PrimaryButton label="Name speichern" onPress={() => updateName(draftName)} />
          </View>
          <View style={styles.buttonFill}>
            <PrimaryButton label="Profilbild wechseln" onPress={cycleAvatar} variant="secondary" />
          </View>
        </View>
      </SectionCard>

      <SectionCard eyebrow="Stats" title="Dein aktueller Stand">
        <View style={styles.chipRow}>
          <StatChip label="Level" value={currentUser.level} />
          <StatChip label="Sessions" value={currentUser.sessionsCount} />
          <StatChip label="Tops" value={currentUserStats.routesCount} />
        </View>
        <Text style={styles.progressTitle}>Fortschritt zum naechsten Skill-Level</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${currentUserStats.progressToNextLevel}%` }]} />
        </View>
        <Text style={styles.progressText}>{currentUserStats.progressToNextLevel}%</Text>
        <PrimaryButton label="Logout" onPress={logout} variant="ghost" />
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  headerCopy: {
    gap: 6,
  },
  name: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  level: {
    color: theme.colors.textMuted,
  },
  input: {
    backgroundColor: theme.colors.cardSoft,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  buttonFill: {
    flex: 1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  progressTitle: {
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
    backgroundColor: theme.colors.accent,
  },
  progressText: {
    color: theme.colors.textMuted,
  },
});
