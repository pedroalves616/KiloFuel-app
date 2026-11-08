import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/presentation/hooks/useAuth';

export default function LoginScreen() {
  const router = useRouter();
  const { login, register, loading, error } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('pedro@kilofuel.com');
  const [password, setPassword] = useState('KiloFuel@2026');

  const handleSubmit = async () => {
    try {
      if (mode === 'login') {
        await login({ email: email.trim(), password });
      } else {
        await register({ name: name.trim(), email: email.trim(), password });
      }
      router.replace('/(tabs)');
    } catch {
      // Erro exibido pelo hook useAuth
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabBtn, mode === 'login' && styles.tabBtnActive]}
            onPress={() => setMode('login')}
          >
            <Text
              style={[
                styles.tabBtnText,
                mode === 'login' && styles.tabBtnTextActive,
              ]}
            >
              Entrar (Login)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, mode === 'register' && styles.tabBtnActive]}
            onPress={() => setMode('register')}
          >
            <Text
              style={[
                styles.tabBtnText,
                mode === 'register' && styles.tabBtnTextActive,
              ]}
            >
              Criar Conta
            </Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {mode === 'register' && (
          <>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Pedro Alves"
              placeholderTextColor="#64748b"
              value={name}
              onChangeText={setName}
            />
          </>
        )}

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha (mín. 8 caracteres)</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.submitBtn}
          disabled={loading}
          onPress={() => void handleSubmit()}
        >
          <Text style={styles.submitBtnText}>
            {loading
              ? 'Autenticando...'
              : mode === 'login'
                ? 'Entrar no KiloFuel'
                : 'Registrar e Entrar'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#10b981',
  },
  tabBtnText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
  },
  tabBtnTextActive: {
    color: '#0f172a',
    fontWeight: '800',
  },
  errorBox: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    borderColor: '#f43f5e',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    color: '#fda4af',
    fontSize: 12,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 14,
    marginBottom: 12,
  },
  submitBtn: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 6,
  },
  submitBtnText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '800',
  },
});

