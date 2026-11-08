import {
  AthleteProfile,
  AuthSession,
  LoginPayload,
  RegisterPayload,
} from '../domain/auth.types';
import { defaultHttpClient, HttpClient } from './http-client';

export class AuthApiService {
  constructor(private readonly http: HttpClient = defaultHttpClient) {}

  public async login(payload: LoginPayload): Promise<AuthSession> {
    return this.http.request<AuthSession>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async register(payload: RegisterPayload): Promise<AuthSession> {
    return this.http.request<AuthSession>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async refresh(refreshToken: string): Promise<AuthSession> {
    return this.http.request<AuthSession>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  public async getMe(): Promise<AthleteProfile> {
    return this.http.request<AthleteProfile>('/auth/me', {
      method: 'GET',
    });
  }
}

export const authApiService = new AuthApiService();

