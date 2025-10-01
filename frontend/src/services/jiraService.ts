'use client';

const API_BASE_URL = 'https://vscode-internal-17271-beta.beta01.cloud.kavia.ai:3001';

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  description?: string;
  lead?: {
    displayName: string;
    emailAddress: string;
  };
}

export interface JiraProjectsResponse {
  projects: JiraProject[];
  total?: number;
}

export interface JiraProjectDetailsResponse {
  project: JiraProject & {
    components?: Array<{
      id: string;
      name: string;
      description?: string;
    }>;
    versions?: Array<{
      id: string;
      name: string;
      description?: string;
      released: boolean;
    }>;
  };
}

// PUBLIC_INTERFACE
export class JiraService {
  /**
   * Service class for handling Jira API operations.
   * Provides methods for fetching projects, project details, and other Jira data.
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

  // Project Operations
  static async getProjects(): Promise<JiraProjectsResponse> {
    return this.makeRequest<JiraProjectsResponse>('/jira/projects');
  }

  static async getProjectDetails(projectKey: string): Promise<JiraProjectDetailsResponse> {
    return this.makeRequest<JiraProjectDetailsResponse>(`/jira/projects/${projectKey}`);
  }

  // Connection Operations
  static async validateConnection(): Promise<{ valid: boolean; message?: string }> {
    try {
      await this.makeRequest('/jira/connection/validate');
      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        message: error instanceof Error ? error.message : 'Connection validation failed' 
      };
    }
  }

  // Utility Methods
  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.makeRequest('/');
  }
}
