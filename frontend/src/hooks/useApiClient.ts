'use client';

import { useCallback } from 'react';
import { apiClient, ApiError, NetworkError } from '../services/api';
import { useApp } from '../contexts/AppContext';

// PUBLIC_INTERFACE
export function useApiClient() {
  /**
   * Custom hook that provides enhanced API client functionality with error handling
   * and notification integration through the app context.
   */
  const app = useApp();

  const handleApiError = useCallback((error: Error, operation: string) => {
    let title = 'API Error';
    let message = 'An unexpected error occurred';

    if (error instanceof ApiError) {
      title = `${operation} Failed`;
      message = error.message;
      
      // Handle specific HTTP status codes
      if (error.status === 401) {
        message = 'Authentication failed. Please log in again.';
      } else if (error.status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (error.status === 404) {
        message = 'The requested resource was not found.';
      } else if (error.status >= 500) {
        message = 'Server error. Please try again later.';
      }
    } else if (error instanceof NetworkError) {
      title = 'Connection Error';
      message = 'Unable to connect to the server. Please check your internet connection.';
    }

    app.addNotification({
      type: 'error',
      title,
      message,
      duration: 5000,
    });

    console.error(`${operation} error:`, error);
  }, [app]);

  const executeWithErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T | null> => {
    try {
      return await operation();
    } catch (error) {
      handleApiError(error as Error, operationName);
      return null;
    }
  }, [handleApiError]);

  // Wrapped API methods with error handling
  const api = {
    // Authentication methods
    startJiraOAuth: () => executeWithErrorHandling(
      () => apiClient.startJiraOAuth(),
      'Start Jira OAuth'
    ),
    startConfluenceOAuth: () => executeWithErrorHandling(
      () => apiClient.startConfluenceOAuth(),
      'Start Confluence OAuth'
    ),
    handleJiraOAuthCallback: (request: Parameters<typeof apiClient.handleJiraOAuthCallback>[0]) =>
      executeWithErrorHandling(
        () => apiClient.handleJiraOAuthCallback(request),
        'Jira OAuth Callback'
      ),
    handleConfluenceOAuthCallback: (request: Parameters<typeof apiClient.handleConfluenceOAuthCallback>[0]) =>
      executeWithErrorHandling(
        () => apiClient.handleConfluenceOAuthCallback(request),
        'Confluence OAuth Callback'
      ),
    authenticateJiraWithToken: (credentials: Parameters<typeof apiClient.authenticateJiraWithToken>[0]) =>
      executeWithErrorHandling(
        () => apiClient.authenticateJiraWithToken(credentials),
        'Jira Token Authentication'
      ),
    authenticateConfluenceWithToken: (credentials: Parameters<typeof apiClient.authenticateConfluenceWithToken>[0]) =>
      executeWithErrorHandling(
        () => apiClient.authenticateConfluenceWithToken(credentials),
        'Confluence Token Authentication'
      ),
    logout: (sessionId?: string) => executeWithErrorHandling(
      () => apiClient.logout(sessionId),
      'Logout'
    ),

    // Jira methods
    getJiraProjects: () => executeWithErrorHandling(
      () => apiClient.getJiraProjects(),
      'Get Jira Projects'
    ),
    getJiraProjectDetails: (projectKey: string) => executeWithErrorHandling(
      () => apiClient.getJiraProjectDetails(projectKey),
      'Get Jira Project Details'
    ),
    validateJiraConnection: () => executeWithErrorHandling(
      () => apiClient.validateJiraConnection(),
      'Validate Jira Connection'
    ),

    // Confluence methods
    getConfluenceSpaces: () => executeWithErrorHandling(
      () => apiClient.getConfluenceSpaces(),
      'Get Confluence Spaces'
    ),
    getConfluenceSpaceDetails: (spaceKey: string) => executeWithErrorHandling(
      () => apiClient.getConfluenceSpaceDetails(spaceKey),
      'Get Confluence Space Details'
    ),
    getConfluenceSpaceContent: (spaceKey: string, limit?: number) => executeWithErrorHandling(
      () => apiClient.getConfluenceSpaceContent(spaceKey, limit),
      'Get Confluence Space Content'
    ),
    validateConfluenceConnection: () => executeWithErrorHandling(
      () => apiClient.validateConfluenceConnection(),
      'Validate Confluence Connection'
    ),

    // Health check
    healthCheck: () => executeWithErrorHandling(
      () => apiClient.healthCheck(),
      'Health Check'
    ),
  };

  return {
    api,
    client: apiClient,
    handleApiError,
    executeWithErrorHandling,
  };
}

export type UseApiClientReturn = ReturnType<typeof useApiClient>;
