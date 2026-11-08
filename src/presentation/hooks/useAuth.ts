import { useCallback, useState } from 'react';
import {
  AthleteProfile,
  LoginPayload,
  RegisterPayload,
} from '@/core/domain/auth.types';
import { authApiService } from '@/core/services/auth-api.service';
import { mobileSessionStore } from '@/core/services/http-client';

export const DEFAULT_SESSION_USER_ID =
  process.env.EXPO_PUBLIC_DEFAULT_ATHLETE_ID ?? 'athlete-001';

export function getEffectiveAthleteId(): string {
  return mobileSessionStore.getAthlete()?.id ?? DEFAULT_SESSION_USER_ID;
}

export function useAuth() {
  const [athlete, setAthlete] = useState<AthleteProfile | null>(() =>
    mobileSessionStore.getAthlete(),
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const session = await authApiService.login(payload);
      mobileSessionStore.setSession({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        athlete: session.athlete,
      });
      setAthlete(session.athlete);
      return session;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Falha ao realizar login.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      const session = await authApiService.register(payload);
      mobileSessionStore.setSession({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        athlete: session.athlete,
      });
      setAthlete(session.athlete);
      return session;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Falha ao registrar conta.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    mobileSessionStore.clear();
    setAthlete(null);
  }, []);

  const athleteId = athlete?.id ?? DEFAULT_SESSION_USER_ID;

  return {
    athlete,
    athleteId,
    loading,
    error,
    login,
    register,
    logout,
  };
}
