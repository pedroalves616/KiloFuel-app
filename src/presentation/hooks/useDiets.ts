import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CreateDietPlanPayload,
  CreateMealPayload,
  DietPlan,
} from '@/core/domain/diet.types';
import { dietApiService } from '@/core/services/diet-api.service';
import { getEffectiveAthleteId } from './useAuth';

export function useDiets(customUserId?: string) {
  const [diets, setDiets] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [mutating, setMutating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resolveUserId = useCallback(
    () => customUserId ?? getEffectiveAthleteId(),
    [customUserId],
  );

  const fetchDiets = useCallback(
    async (isPullToRefresh = false) => {
      if (isPullToRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      try {
        const userId = resolveUserId();
        const data = await dietApiService.listByUser(userId, false);
        setDiets(data);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Não foi possível carregar os planos alimentares.';
        setError(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [resolveUserId],
  );

  useEffect(() => {
    void fetchDiets(false);
  }, [fetchDiets]);

  const onRefresh = useCallback(() => {
    void fetchDiets(true);
  }, [fetchDiets]);

  const createDiet = useCallback(
    async (
      payload: Omit<CreateDietPlanPayload, 'athleteId'> & {
        athleteId?: string;
      },
    ): Promise<DietPlan> => {
      setMutating(true);
      setError(null);
      try {
        const created = await dietApiService.create({
          ...payload,
          athleteId: payload.athleteId ?? resolveUserId(),
        });
        await fetchDiets(false);
        return created;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Erro ao criar plano alimentar.';
        setError(message);
        throw err;
      } finally {
        setMutating(false);
      }
    },
    [fetchDiets, resolveUserId],
  );

  const addMeal = useCallback(
    async (dietId: string, meal: CreateMealPayload): Promise<DietPlan> => {
      setMutating(true);
      setError(null);
      try {
        const updated = await dietApiService.addMeal(dietId, meal);
        await fetchDiets(true);
        return updated;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Erro ao registrar refeição no plano.';
        setError(message);
        throw err;
      } finally {
        setMutating(false);
      }
    },
    [fetchDiets],
  );

  const activeDiet = useMemo(
    () => diets.find((plan) => plan.isActive) ?? diets[0] ?? null,
    [diets],
  );

  return {
    diets,
    activeDiet,
    loading,
    refreshing,
    mutating,
    error,
    fetchDiets,
    onRefresh,
    createDiet,
    addMeal,
  };
}
