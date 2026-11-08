import { AthleteProfile } from '../domain/auth.types';

export interface ApiProblemDetails {
  statusCode: number;
  error: string;
  code?: string;
  message: string | string[];
  path?: string;
  timestamp?: string;
}

export class ApiClientError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: ApiProblemDetails;

  constructor(problem: ApiProblemDetails) {
    const normalizedMessage = Array.isArray(problem.message)
      ? problem.message.join(', ')
      : problem.message || 'Erro inesperado ao comunicar com a API KiloFuel.';
    super(normalizedMessage);
    this.name = 'ApiClientError';
    this.statusCode = problem.statusCode;
    this.code = problem.code ?? problem.error ?? 'API_ERROR';
    this.details = problem;
  }
}

class MobileSessionStore {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private athlete: AthleteProfile | null = null;

  public setSession(params: {
    accessToken: string;
    refreshToken: string;
    athlete: AthleteProfile;
  }): void {
    this.accessToken = params.accessToken;
    this.refreshToken = params.refreshToken;
    this.athlete = params.athlete;
  }

  public clear(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.athlete = null;
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public getRefreshToken(): string | null {
    return this.refreshToken;
  }

  public getAthlete(): AthleteProfile | null {
    return this.athlete;
  }
}

export const mobileSessionStore = new MobileSessionStore();

export class HttpClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(baseUrl?: string, timeoutMs = 10000) {
    this.baseUrl = (
      baseUrl ??
      process.env.EXPO_PUBLIC_API_URL ??
      'http://localhost:3000'
    ).replace(/\/$/, '');
    this.timeoutMs = timeoutMs;
  }

  public async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> | undefined),
    };

    if (!headers['Content-Type'] && options.body) {
      headers['Content-Type'] = 'application/json';
    }

    const token = mobileSessionStore.getAccessToken();
    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      if (!response.ok) {
        let problem: ApiProblemDetails = {
          statusCode: response.status,
          error: response.statusText || 'HTTP_ERROR',
          message: `Falha na requisição (${response.status})`,
        };

        try {
          const parsed = (await response.json()) as Partial<ApiProblemDetails>;
          problem = {
            statusCode: parsed.statusCode ?? response.status,
            error: parsed.error ?? response.statusText,
            code: parsed.code,
            message: parsed.message ?? problem.message,
            path: parsed.path,
            timestamp: parsed.timestamp,
          };
        } catch {
          // Mantém fallback estruturado RFC 7807
        }

        throw new ApiClientError(problem);
      }

      return (await response.json()) as T;
    } catch (error: unknown) {
      if (error instanceof ApiClientError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiClientError({
          statusCode: 408,
          error: 'REQUEST_TIMEOUT',
          code: 'REQUEST_TIMEOUT',
          message: 'Tempo limite de conexão com a API KiloFuel excedido.',
        });
      }
      throw new ApiClientError({
        statusCode: 503,
        error: 'NETWORK_ERROR',
        code: 'NETWORK_ERROR',
        message:
          error instanceof Error
            ? error.message
            : 'Falha de conexão com o servidor KiloFuel.',
      });
    } finally {
      clearTimeout(timer);
    }
  }
}

export const defaultHttpClient = new HttpClient();
