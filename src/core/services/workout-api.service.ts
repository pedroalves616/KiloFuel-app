import {
  CreateWorkoutPlanPayload,
  WorkoutPlan,
} from '../domain/workout.types';
import { defaultHttpClient, HttpClient } from './http-client';

export class WorkoutApiService {
  constructor(private readonly http: HttpClient = defaultHttpClient) {}

  public async listByUser(
    userId: string,
    onlyActive = false,
  ): Promise<WorkoutPlan[]> {
    const query = onlyActive ? '?onlyActive=true' : '';
    return this.http.request<WorkoutPlan[]>(
      `/workouts/user/${encodeURIComponent(userId)}${query}`,
      { method: 'GET' },
    );
  }

  public async getById(id: string): Promise<WorkoutPlan> {
    return this.http.request<WorkoutPlan>(
      `/workouts/${encodeURIComponent(id)}`,
      { method: 'GET' },
    );
  }

  public async create(payload: CreateWorkoutPlanPayload): Promise<WorkoutPlan> {
    return this.http.request<WorkoutPlan>('/workouts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async toggleActive(id: string): Promise<WorkoutPlan> {
    return this.http.request<WorkoutPlan>(
      `/workouts/${encodeURIComponent(id)}/toggle-active`,
      {
        method: 'PATCH',
      },
    );
  }
}

export const workoutApiService = new WorkoutApiService();

