import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0f172a' },
          headerTintColor: '#f8fafc',
          headerTitleStyle: { fontWeight: '800' },
          contentStyle: { backgroundColor: '#0f172a' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="workouts/create"
          options={{
            title: 'Prescrever Novo Treino',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="nutrition/create"
          options={{
            title: 'Novo Plano Alimentar',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            title: 'Conta KiloFuel (Login / Registro)',
            presentation: 'modal',
          }}
        />
      </Stack>
    </>
  );
}

