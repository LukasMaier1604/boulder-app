import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AvatarBadge } from './AvatarBadge';
import { theme } from '../data/theme';

export function UserRow({ user, onPress, subtitle }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <AvatarBadge color={user.avatarColor} name={user.name} size={46} />
      <View style={styles.copy}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.cardSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  pressed: {
    opacity: 0.88,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  chevron: {
    color: theme.colors.textMuted,
    fontSize: 28,
  },
});
