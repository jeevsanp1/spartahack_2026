import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Home, Gift } from 'lucide-react-native'; // Changed icon from History to Gift

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF6D1F', // Orange Accent
        tabBarInactiveTintColor: '#94A3B8', // Slate 400
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E293B', // Slate 800
          borderTopColor: '#334155',
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Wallet', // Changed from Home
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Rewards', // Changed from History to Rewards
          tabBarIcon: ({ color }) => <Gift size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
