import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#f8fafc',
        headerTitleStyle: { fontWeight: '800' },
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: '#1e293b',
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: '#64748b',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="speedometer-outline" size={size} color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Treinos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barbell-outline" size={size} color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrição',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flame-outline" size={size} color={String(color)} />
          ),
        }}
      />
    </Tabs>
  );
}

