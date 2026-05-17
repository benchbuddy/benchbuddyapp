import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: '#0CA86B',
            borderTopColor: 'transparent',
          },
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: 'rgba(255,255,255,0.7)',
          tabBarLabelStyle: {
            fontWeight: '700',
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Map',
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol size={focused ? 32 : 28} name="map.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="benches"
          options={{
            title: 'Benches',
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol size={focused ? 32 : 28} name="mappin.and.ellipse" color={color} />
            ),
          }}
        />
      </Tabs>
      <StatusBar style="auto" />
    </>
  );
}
