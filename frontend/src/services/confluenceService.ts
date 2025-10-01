'use client';

const API_BASE_URL = 'https://vscode-internal-17271-beta.beta01.cloud.kavia.ai:3001';

export interface ConfluenceSpace {
  id: string;
  key: string;
  name: string;
  type: string;
  description?: {
    plain?: {
      value: string;
    };
  };
  homepage?: {
    id: string;
    title: string;
  };
}

export interface ConfluenceContent {
  id: string;
  title: string;
  type: string;
  status: string;
  space: {
    key: string;
    name: string;
  };
}

export interface ConfluenceSpacesResponse {
  spaces: ConfluenceSpace[];
  total?: number;
}

export interface ConfluenceSpaceDetailsResponse {
  space: ConfluenceSpace & {
    permissions?: Array<{
      operation: string;
      targetType: string;
    }>;
  };
}

export interface ConfluenceContentResponse {
  content: ConfluenceContent[];
  total?: number;
  start?: number;
  limit?: number;
}

// PUBLIC_INTERFACE
export class ConfluenceService {
  /**
   * Service class for handling Confluence API operations.
   * Provides methods for fetching spaces, content, and other Confluence data.
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

  // Space Operations
  static async getSpaces(): Promise<ConfluenceSpacesResponse> {
    return this.makeRequest<ConfluenceSpacesResponse>('/confluence/spaces');
  }

  static async getSpaceDetails(spaceKey: string): Promise<ConfluenceSpaceDetailsResponse> {
    return this.makeRequest<ConfluenceSpaceDetailsResponse>(`/confluence/spaces/${spaceKey}`);
  }

  static async getSpaceContent(
    spaceKey: string, 
    limit: number = 25
  ): Promise<ConfluenceContentResponse> {
    return this.makeRequest<ConfluenceContentResponse>(
      `/confluence/spaces/${spaceKey}/content?limit=${limit}`
    );
  }

  // Connection Operations
  static async validateConnection(): Promise<{ valid: boolean; message?: string }> {
    try {
      await this.makeRequest('/confluence/connection/validate');
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
