import React from 'react';
import { Platform, StyleSheet, useColorScheme } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';

const AMBER = '#B45309';

export default function PrefeituraLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: AMBER,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: isIOS ? 'transparent' : colors.background,
          borderTopWidth: 0,
          elevation: 0,
          height: isWeb ? 84 : 60,
        },
        tabBarBackground: () =>
          isIOS ? <BlurView intensity={95} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} /> : null,
        tabBarLabelStyle: { fontSize: 10, fontFamily: 'Inter_600SemiBold', marginTop: -2 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Painel', tabBarIcon: ({ color }) => <Ionicons name="grid" size={22} color={color} /> }} />
      <Tabs.Screen name="demandas" options={{ title: 'Demandas', tabBarIcon: ({ color }) => <Ionicons name="warning" size={22} color={color} /> }} />
      <Tabs.Screen name="projetos" options={{ title: 'Projetos', tabBarIcon: ({ color }) => <Ionicons name="layers" size={22} color={color} /> }} />
      <Tabs.Screen name="dados" options={{ title: 'Dados', tabBarIcon: ({ color }) => <Ionicons name="bar-chart" size={22} color={color} /> }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: ({ color }) => <Ionicons name="shield" size={22} color={color} /> }} />
    </Tabs>
  );
}
