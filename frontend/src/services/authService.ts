'use client';

const API_BASE_URL = 'https://vscode-internal-17271-beta.beta01.cloud.kavia.ai:3001';

export interface ApiTokenCredentials {
  domain: string;
  email: string;
  apiToken: string;
}

export interface OAuthStartResponse {
  auth_url: string;
  state: string;
}

export interface UserInfo {
  email?: string;
  displayName?: string;
  domain?: string;
  accountId?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  session_id?: string;
  user_info?: UserInfo;
}

export interface OAuthCallbackRequest {
  code: string;
  state: string;
}

// PUBLIC_INTERFACE
export class AuthService {
  /**
   * Service class for handling authentication operations with Jira and Confluence APIs.
   * Provides methods for OAuth flows, API token authentication, and session management.
   */

  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // OAuth Methods
  static async startJiraOAuth(): Promise<OAuthStartResponse> {
    return this.makeRequest<OAuthStartResponse>('/auth/jira/oauth/start');
  }

  static async startConfluenceOAuth(): Promise<OAuthStartResponse> {
    return this.makeRequest<OAuthStartResponse>('/auth/confluence/oauth/start');
  }

  static async handleJiraOAuthCallback(request: OAuthCallbackRequest): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/jira/oauth/callback', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async handleConfluenceOAuthCallback(request: OAuthCallbackRequest): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/confluence/oauth/callback', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // API Token Methods
  static async authenticateJiraWithToken(credentials: ApiTokenCredentials): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/jira/api-token', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  static async authenticateConfluenceWithToken(credentials: ApiTokenCredentials): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/confluence/api-token', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Session Management
  static async logout(sessionId?: string): Promise<AuthResponse> {
    const endpoint = sessionId ? `/auth/logout?session_id=${sessionId}` : '/auth/logout';
    return this.makeRequest<AuthResponse>(endpoint, {
      method: 'POST',
    });
  }

  // Connection Validation
  static async validateJiraConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/jira/connection/validate');
      return true;
    } catch (error) {
      console.error('Jira connection validation failed:', error);
      return false;
    }
  }

  static async validateConfluenceConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/confluence/connection/validate');
      return true;
    } catch (error) {
      console.error('Confluence connection validation failed:', error);
      return false;
    }
  }
}
