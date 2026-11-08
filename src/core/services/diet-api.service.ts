import {
  CreateDietPlanPayload,
  CreateMealPayload,
  DietPlan,
} from '../domain/diet.types';
import { defaultHttpClient, HttpClient } from './http-client';

export class DietApiService {
  constructor(private readonly http: HttpClient = defaultHttpClient) {}

  public async listByUser(
    userId: string,
    onlyActive = false,
  ): Promise<DietPlan[]> {
    const query = onlyActive ? '?onlyActive=true' : '';
    return this.http.request<DietPlan[]>(
      `/diets/user/${encodeURIComponent(userId)}${query}`,
      { method: 'GET' },
    );
  }

  public async getById(id: string): Promise<DietPlan> {
    return this.http.request<DietPlan>(`/diets/${encodeURIComponent(id)}`, {
      method: 'GET',
    });
  }

  public async create(payload: CreateDietPlanPayload): Promise<DietPlan> {
    return this.http.request<DietPlan>('/diets', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async addMeal(
    dietId: string,
    payload: CreateMealPayload,
  ): Promise<DietPlan> {
    return this.http.request<DietPlan>(
      `/diets/${encodeURIComponent(dietId)}/meals`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );
  }
}

export const dietApiService = new DietApiService();

