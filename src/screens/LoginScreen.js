import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppScreen } from '../components/AppScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionCard } from '../components/SectionCard';
import { useAppState } from '../hooks/useAppState';
import { theme } from '../data/theme';

export function LoginScreen() {
  const { error, loading, login, register } = useAppState();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isRegister = mode === 'register';
  const formError = useMemo(() => {
    if (!email.trim() || !password) {
      return 'E-Mail und Passwort sind erforderlich.';
    }

    if (isRegister && name.trim().length < 2) {
      return 'Name muss mindestens 2 Zeichen haben.';
    }

    if (isRegister && password.length < 8) {
      return 'Passwort muss mindestens 8 Zeichen haben.';
    }

    return null;
  }, [email, isRegister, name, password]);

  const handleSubmit = () => {
    const payload = { name, email, password };

    if (isRegister) {
      register(payload);
      return;
    }

    login(payload);
  };

  return (
    <AppScreen>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Kletterwerk Radolfzell</Text>
        <Text style={styles.title}>Dein Boulder-Account</Text>
        <Text style={styles.subtitle}>
          Melde dich an oder lege einen neuen User an. Danach startet deine Session und dein Tracking direkt ueber das Backend.
        </Text>
      </View>

      <SectionCard eyebrow="Account" title={isRegister ? 'Registrieren' : 'Einloggen'}>
        <View style={styles.segmented}>
          <Pressable
            onPress={() => setMode('login')}
            style={[styles.segment, !isRegister && styles.segmentActive]}
          >
            <Text style={[styles.segmentLabel, !isRegister && styles.segmentLabelActive]}>Login</Text>
          </Pressable>
          <Pressable
            onPress={() => setMode('register')}
            style={[styles.segment, isRegister && styles.segmentActive]}
          >
            <Text style={[styles.segmentLabel, isRegister && styles.segmentLabelActive]}>
              Registrieren
            </Text>
          </Pressable>
        </View>

        {isRegister ? (
          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              autoCapitalize="words"
              onChangeText={setName}
              placeholder="Max Mustermann"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.input}
              value={name}
            />
          </View>
        ) : null}

        <View style={styles.field}>
          <Text style={styles.label}>E-Mail</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            inputMode="email"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="du@example.com"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.input}
            value={email}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Passwort</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setPassword}
            placeholder={isRegister ? 'Mindestens 8 Zeichen' : 'Dein Passwort'}
            placeholderTextColor={theme.colors.textMuted}
            secureTextEntry
            style={styles.input}
            value={password}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton
          disabled={loading || Boolean(formError)}
          label={loading ? 'Verbinde...' : isRegister ? 'Account erstellen' : 'Einloggen'}
          onPress={handleSubmit}
        />

        {formError ? <Text style={styles.hint}>{formError}</Text> : null}
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
  segmented: {
    flexDirection: 'row',
    backgroundColor: theme.colors.cardSoft,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 4,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
  },
  segmentActive: {
    backgroundColor: theme.colors.accent,
  },
  segmentLabel: {
    color: theme.colors.textMuted,
    fontWeight: '800',
  },
  segmentLabelActive: {
    color: '#101316',
  },
  field: {
    gap: 8,
  },
  label: {
    color: theme.colors.text,
    fontWeight: '700',
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
  error: {
    color: theme.colors.danger,
    lineHeight: 20,
  },
  hint: {
    color: theme.colors.textMuted,
    lineHeight: 20,
    textAlign: 'center',
  },
});
