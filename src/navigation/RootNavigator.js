import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { RouteScreen } from '../screens/RouteScreen';
import { LeaderboardScreen } from '../screens/LeaderboardScreen';
import { UserDetailScreen } from '../screens/UserDetailScreen';
import { AchievementsScreen } from '../screens/AchievementsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SessionStartScreen } from '../screens/SessionStartScreen';
import { useAppState } from '../hooks/useAppState';
import { theme } from '../data/theme';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ScanStack = createNativeStackNavigator();
const LeaderboardStack = createNativeStackNavigator();

function createScreenOptions(title) {
  return {
    headerStyle: { backgroundColor: theme.colors.backgroundAlt },
    headerTintColor: theme.colors.text,
    headerTitle: title,
    contentStyle: { backgroundColor: theme.colors.background },
  };
}

function ScanNavigator() {
  return (
    <ScanStack.Navigator screenOptions={{ headerShown: false }}>
      <ScanStack.Screen component={ScanScreen} name="ScanHome" />
      <ScanStack.Screen component={RouteScreen} name="RouteDetails" />
    </ScanStack.Navigator>
  );
}

function LeaderboardNavigator() {
  return (
    <LeaderboardStack.Navigator>
      <LeaderboardStack.Screen
        component={LeaderboardScreen}
        name="LeaderboardHome"
        options={createScreenOptions('Leaderboard')}
      />
      <LeaderboardStack.Screen
        component={UserDetailScreen}
        name="UserDetail"
        options={createScreenOptions('Athlet Profil')}
      />
    </LeaderboardStack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#15191D',
          borderTopColor: theme.colors.border,
          height: 74,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: theme.colors.accentSoft,
        tabBarInactiveTintColor: theme.colors.tabInactive,
        tabBarIcon: ({ color, size }) => {
          const iconMap = {
            Home: 'home',
            Scan: 'scan',
            Leaderboard: 'podium',
            Achievements: 'ribbon',
            Profile: 'person',
          };

          return <Ionicons color={color} name={iconMap[route.name]} size={size} />;
        },
      })}
    >
      <Tab.Screen component={HomeScreen} name="Home" />
      <Tab.Screen component={ScanNavigator} name="Scan" />
      <Tab.Screen component={LeaderboardNavigator} name="Leaderboard" />
      <Tab.Screen component={AchievementsScreen} name="Achievements" />
      <Tab.Screen component={ProfileScreen} name="Profile" />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { currentUser, sessionActive } = useAppState();

  const navigationTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: theme.colors.background,
      card: theme.colors.backgroundAlt,
      border: theme.colors.border,
      text: theme.colors.text,
      primary: theme.colors.accent,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      {!currentUser ? (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen component={LoginScreen} name="Login" />
        </RootStack.Navigator>
      ) : !sessionActive ? (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen component={SessionStartScreen} name="SessionStart" />
        </RootStack.Navigator>
      ) : (
        <AppTabs />
      )}
    </NavigationContainer>
  );
}
