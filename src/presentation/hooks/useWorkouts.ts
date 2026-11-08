import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CreateWorkoutPlanPayload,
  WorkoutPlan,
} from '@/core/domain/workout.types';
import { workoutApiService } from '@/core/services/workout-api.service';
import { getEffectiveAthleteId } from './useAuth';

export function useWorkouts(customUserId?: string) {
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [mutating, setMutating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resolveUserId = useCallback(
    () => customUserId ?? getEffectiveAthleteId(),
    [customUserId],
  );

  const fetchWorkouts = useCallback(
    async (isPullToRefresh = false) => {
      if (isPullToRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      try {
        const userId = resolveUserId();
        const data = await workoutApiService.listByUser(userId, false);
        setWorkouts(data);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Não foi possível carregar os planos de treino.';
        setError(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [resolveUserId],
  );

  useEffect(() => {
    void fetchWorkouts(false);
  }, [fetchWorkouts]);

  const onRefresh = useCallback(() => {
    void fetchWorkouts(true);
  }, [fetchWorkouts]);

  const createWorkout = useCallback(
    async (
      payload: Omit<CreateWorkoutPlanPayload, 'athleteId'> & {
        athleteId?: string;
      },
    ): Promise<WorkoutPlan> => {
      setMutating(true);
      setError(null);
      try {
        const created = await workoutApiService.create({
          ...payload,
          athleteId: payload.athleteId ?? resolveUserId(),
        });
        await fetchWorkouts(false);
        return created;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Erro ao criar plano de treino.';
        setError(message);
        throw err;
      } finally {
        setMutating(false);
      }
    },
    [fetchWorkouts, resolveUserId],
  );

  const toggleWorkoutActive = useCallback(
    async (workoutId: string): Promise<WorkoutPlan> => {
      setMutating(true);
      setError(null);
      try {
        const updated = await workoutApiService.toggleActive(workoutId);
        await fetchWorkouts(true);
        return updated;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Erro ao alternar status do plano de treino.';
        setError(message);
        throw err;
      } finally {
        setMutating(false);
      }
    },
    [fetchWorkouts],
  );

  const activeWorkout = useMemo(
    () => workouts.find((plan) => plan.isActive) ?? null,
    [workouts],
  );

  return {
    workouts,
    activeWorkout,
    loading,
    refreshing,
    mutating,
    error,
    fetchWorkouts,
    onRefresh,
    createWorkout,
    toggleWorkoutActive,
  };
}
