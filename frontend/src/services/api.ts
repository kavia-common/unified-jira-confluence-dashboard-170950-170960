'use client';

// Backend API schema types based on OpenAPI specification
export interface APITokenRequest {
  domain: string;
  email: string;
  api_token: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  session_id?: string | null;
  user_info?: Record<string, unknown> | null;
}

export interface OAuthStartResponse {
  auth_url: string;
  state: string;
}

export interface OAuthCallbackRequest {
  code: string;
  state: string;
}

// Jira types
export interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  simplified?: boolean;
  style?: string;
  isPrivate?: boolean;
  description?: string;
}

// Confluence types
export interface ConfluenceSpace {
  id: string;
  key: string;
  name: string;
  type: string;
  description?: {
    plain: {
      value: string;
      representation?: string;
    };
  };
  homepage?: {
    id: string;
    title: string;
  };
}

export interface ConfluenceContent {
  id: string;
  type: string;
  status: string;
  title: string;
  space?: {
    id: string;
    key: string;
    name: string;
    type: string;
  };
  // Optional history metadata present in some responses
  history?: {
    createdBy?: {
      type?: string;
      displayName?: string;
      userKey?: string;
      accountId?: string;
    };
    createdDate?: string;
    latest?: boolean;
  };
  version?: {
    number?: number;
    when?: string;
  };
}

// API Client Configuration
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  withCredentials?: boolean;
}

// API Client Error Types
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string, public originalError: Error) {
    super(message);
    this.name = 'NetworkError';
  }
}

// Response wrapper type
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

// PUBLIC_INTERFACE
export class ApiClient {
  /**
   * Centralized API client for communicating with the backend.
   */
  private config: Required<ApiClientConfig>;

  constructor(config: ApiClientConfig) {
    this.config = {
      timeout: 30000,
      withCredentials: true,
      ...config,
    };
  }

  private async makeRequest<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        credentials: this.config.withCredentials ? 'include' : 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData: Record<string, unknown> = {};
        try {
          errorData = await response.json();
        } catch {
          // ignore
        }

        type ErrorShape = { message?: unknown; detail?: unknown };
        const errObj = errorData as ErrorShape;
        const message = (typeof errObj.message === 'string' ? errObj.message : '') ||
                       (typeof errObj.detail === 'string' ? errObj.detail : '') ||
                       `HTTP ${response.status}: ${response.statusText}`;

        throw new ApiError(
          message,
          response.status,
          response.statusText,
          errorData
        );
      }

      const data = await response.json();

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new NetworkError('Request timeout', error);
        }
        throw new NetworkError('Network request failed', error);
      }

      throw new NetworkError('Unknown error occurred', new Error(String(error)));
    }
  }

  // Authentication Endpoints
  async startJiraOAuth(): Promise<OAuthStartResponse> {
    const response = await this.makeRequest<OAuthStartResponse>('/auth/jira/oauth/start');
    return response.data;
  }

  async startConfluenceOAuth(): Promise<OAuthStartResponse> {
    const response = await this.makeRequest<OAuthStartResponse>('/auth/confluence/oauth/start');
    return response.data;
  }

  async handleJiraOAuthCallback(request: OAuthCallbackRequest): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/jira/oauth/callback', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return response.data;
  }

  async handleConfluenceOAuthCallback(request: OAuthCallbackRequest): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/confluence/oauth/callback', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return response.data;
  }

  async authenticateJiraWithToken(credentials: APITokenRequest): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/jira/api-token', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response.data;
  }

  async authenticateConfluenceWithToken(credentials: APITokenRequest): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/confluence/api-token', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response.data;
  }

  async logout(sessionId?: string): Promise<AuthResponse> {
    const endpoint = sessionId ? `/auth/logout?session_id=${encodeURIComponent(sessionId)}` : '/auth/logout';
    const response = await this.makeRequest<AuthResponse>(endpoint, {
      method: 'POST',
    });
    return response.data;
  }

  // Jira Endpoints
  async getJiraProjects(): Promise<JiraProject[]> {
    const response = await this.makeRequest<JiraProject[]>('/jira/projects');
    return response.data;
  }

  async getJiraProjectDetails(projectKey: string): Promise<JiraProject> {
    const response = await this.makeRequest<JiraProject>(`/jira/projects/${encodeURIComponent(projectKey)}`);
    return response.data;
  }

  async validateJiraConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/jira/connection/validate');
      return true;
    } catch (error) {
      console.error('Jira connection validation failed:', error);
      return false;
    }
  }

  // Confluence Endpoints
  async getConfluenceSpaces(): Promise<ConfluenceSpace[]> {
    const response = await this.makeRequest<ConfluenceSpace[]>('/confluence/spaces');
    return response.data;
  }

  async getConfluenceSpaceDetails(spaceKey: string): Promise<ConfluenceSpace> {
    const response = await this.makeRequest<ConfluenceSpace>(`/confluence/spaces/${encodeURIComponent(spaceKey)}`);
    return response.data;
  }

  async getConfluenceSpaceContent(spaceKey: string, limit: number = 25): Promise<ConfluenceContent[]> {
    const response = await this.makeRequest<ConfluenceContent[]>(
      `/confluence/spaces/${encodeURIComponent(spaceKey)}/content?limit=${limit}`
    );
    return response.data;
  }

  async validateConfluenceConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/confluence/connection/validate');
      return true;
    } catch (error) {
      console.error('Confluence connection validation failed:', error);
      return false;
    }
  }

  // Health Check
  async healthCheck(): Promise<Record<string, unknown>> {
    const response = await this.makeRequest<Record<string, unknown>>('/');
    return response.data;
  }
}

// Default API client instance using env
const defaultConfig: ApiClientConfig = {
  // Use env variable; orchestrator will set this. See .env.example
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  timeout: 30000,
  withCredentials: true,
};

export const apiClient = new ApiClient(defaultConfig);

// Convenience functions using the default client
export const api = {
  // Auth
  startJiraOAuth: () => apiClient.startJiraOAuth(),
  startConfluenceOAuth: () => apiClient.startConfluenceOAuth(),
  handleJiraOAuthCallback: (request: OAuthCallbackRequest) => apiClient.handleJiraOAuthCallback(request),
  handleConfluenceOAuthCallback: (request: OAuthCallbackRequest) => apiClient.handleConfluenceOAuthCallback(request),
  authenticateJiraWithToken: (credentials: APITokenRequest) => apiClient.authenticateJiraWithToken(credentials),
  authenticateConfluenceWithToken: (credentials: APITokenRequest) => apiClient.authenticateConfluenceWithToken(credentials),
  logout: (sessionId?: string) => apiClient.logout(sessionId),

  // Jira
  getJiraProjects: () => apiClient.getJiraProjects(),
  getJiraProjectDetails: (projectKey: string) => apiClient.getJiraProjectDetails(projectKey),
  validateJiraConnection: () => apiClient.validateJiraConnection(),

  // Confluence
  getConfluenceSpaces: () => apiClient.getConfluenceSpaces(),
  getConfluenceSpaceDetails: (spaceKey: string) => apiClient.getConfluenceSpaceDetails(spaceKey),
  getConfluenceSpaceContent: (spaceKey: string, limit?: number) => apiClient.getConfluenceSpaceContent(spaceKey, limit),
  validateConfluenceConnection: () => apiClient.validateConfluenceConnection(),

  // Health
  healthCheck: () => apiClient.healthCheck(),
};
