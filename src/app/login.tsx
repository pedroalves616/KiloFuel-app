import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/presentation/hooks/useAuth';

type AuthMode = 'login' | 'register';

export default function LoginScreen() {
  const router = useRouter();
  const { login, register, loading, error } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const isRegistering = mode === 'register';
  const normalizedEmail = email.trim();
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
  const canSubmit =
    isEmailValid &&
    password.length > 0 &&
    (!isRegistering || (name.trim().length >= 2 && password.length >= 8));

  const handleSubmit = async () => {
    setValidationError(null);

    if (!isEmailValid) {
      setValidationError('Informe um endereço de e-mail válido.');
      return;
    }

    if (!password) {
      setValidationError('Informe sua senha.');
      return;
    }

    if (isRegistering && name.trim().length < 2) {
      setValidationError('Informe seu nome com pelo menos 2 caracteres.');
      return;
    }

    if (isRegistering && password.length < 8) {
      setValidationError('A senha precisa ter pelo menos 8 caracteres.');
      return;
    }

    try {
      if (isRegistering) {
        await register({
          name: name.trim(),
          email: normalizedEmail,
          password,
        });
      } else {
        await login({ email: normalizedEmail, password });
      }

      router.replace('/(tabs)');
    } catch {
      // O hook useAuth disponibiliza o erro para a interface.
    }
  };

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setValidationError(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandMark}>
          <Ionicons name="fitness" size={30} color="#07130f" />
        </View>
        <Text style={styles.brand}>KiloFuel</Text>
        <Text style={styles.tagline}>Treine com propósito. Evolua sempre.</Text>

        <View style={styles.card}>
          <Text style={styles.title}>
            {isRegistering ? 'Crie sua conta' : 'Bem-vindo de volta'}
          </Text>
          <Text style={styles.subtitle}>
            {isRegistering
              ? 'Cadastre-se para acompanhar sua jornada.'
              : 'Entre para acessar seus treinos e sua nutrição.'}
          </Text>

          <View style={styles.modeSelector}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: !isRegistering }}
              style={[
                styles.modeButton,
                !isRegistering && styles.modeButtonSelected,
              ]}
              onPress={() => changeMode('login')}
            >
              <Text
                style={[
                  styles.modeText,
                  !isRegistering && styles.modeTextSelected,
                ]}
              >
                Entrar
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isRegistering }}
              style={[
                styles.modeButton,
                isRegistering && styles.modeButtonSelected,
              ]}
              onPress={() => changeMode('register')}
            >
              <Text
                style={[
                  styles.modeText,
                  isRegistering && styles.modeTextSelected,
                ]}
              >
                Criar conta
              </Text>
            </Pressable>
          </View>

          {isRegistering && (
            <View style={styles.field}>
              <Text style={styles.label}>Nome</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={19}
                  color="#94a3b8"
                  style={styles.inputIcon}
                />
                <TextInput
                  accessibilityLabel="Nome"
                  style={styles.input}
                  placeholder="Seu nome"
                  placeholderTextColor="#64748b"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoComplete="name"
                  returnKeyType="next"
                />
              </View>
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>E-mail</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={19}
                color="#94a3b8"
                style={styles.inputIcon}
              />
              <TextInput
                accessibilityLabel="E-mail"
                style={styles.input}
                placeholder="voce@exemplo.com"
                placeholderTextColor="#64748b"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                textContentType="emailAddress"
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={19}
                color="#94a3b8"
                style={styles.inputIcon}
              />
              <TextInput
                accessibilityLabel="Senha"
                style={styles.input}
                placeholder={
                  isRegistering ? 'Mínimo de 8 caracteres' : 'Sua senha'
                }
                placeholderTextColor="#64748b"
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoComplete={isRegistering ? 'new-password' : 'password'}
                textContentType={
                  isRegistering ? 'newPassword' : 'password'
                }
                secureTextEntry={!passwordVisible}
                returnKeyType="done"
                onSubmitEditing={() => void handleSubmit()}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  passwordVisible ? 'Ocultar senha' : 'Mostrar senha'
                }
                onPress={() => setPasswordVisible((visible) => !visible)}
                hitSlop={10}
              >
                <Ionicons
                  name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#94a3b8"
                />
              </Pressable>
            </View>
          </View>

          {(validationError || error) && (
            <View style={styles.errorBox} accessibilityRole="alert">
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color="#fda4af"
              />
              <Text style={styles.errorText}>{validationError ?? error}</Text>
            </View>
          )}

          <Pressable
            accessibilityRole="button"
            disabled={loading || !canSubmit}
            style={({ pressed }) => [
              styles.submitButton,
              (!canSubmit || loading) && styles.submitButtonDisabled,
              pressed && canSubmit && !loading && styles.submitButtonPressed,
            ]}
            onPress={() => void handleSubmit()}
          >
            {loading ? (
              <ActivityIndicator color="#07130f" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>
                  {isRegistering ? 'Criar conta' : 'Entrar'}
                </Text>
                <Ionicons name="arrow-forward" size={19} color="#07130f" />
              </>
            )}
          </Pressable>

          <View style={styles.privacyNote}>
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color="#94a3b8"
            />
            <Text style={styles.privacyText}>
              Seus dados são usados para acessar sua conta KiloFuel.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 28,
  },
  brandMark: {
    width: 58,
    height: 58,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#10b981',
    marginBottom: 12,
  },
  brand: {
    color: '#f8fafc',
    fontSize: 29,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  tagline: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 25,
  },
  card: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 20,
  },
  title: {
    color: '#f8fafc',
    fontSize: 23,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 20,
  },
  modeSelector: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#0f172a',
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    borderRadius: 9,
  },
  modeButtonSelected: {
    backgroundColor: '#10b981',
  },
  modeText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
  },
  modeTextSelected: {
    color: '#07130f',
  },
  field: {
    marginBottom: 15,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 7,
  },
  inputContainer: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 13,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 15,
    paddingVertical: 12,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderColor: 'rgba(244, 63, 94, 0.45)',
    borderWidth: 1,
    borderRadius: 11,
    padding: 11,
    marginBottom: 14,
  },
  errorText: {
    flex: 1,
    color: '#fda4af',
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 8,
  },
  submitButton: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    borderRadius: 13,
    marginTop: 4,
  },
  submitButtonDisabled: {
    opacity: 0.48,
  },
  submitButtonPressed: {
    backgroundColor: '#34d399',
  },
  submitButtonText: {
    color: '#07130f',
    fontSize: 15,
    fontWeight: '800',
    marginRight: 9,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 17,
  },
  privacyText: {
    color: '#94a3b8',
    fontSize: 11,
    marginLeft: 6,
  },
});
