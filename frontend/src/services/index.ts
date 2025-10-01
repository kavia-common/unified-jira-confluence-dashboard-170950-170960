// PUBLIC_INTERFACE
/**
 * Services barrel export file.
 * Provides centralized exports for all API service classes and the new centralized API client.
 */

// Legacy services (maintained for backward compatibility)
export { AuthService } from './authService';
export { JiraService } from './jiraService';
export { ConfluenceService } from './confluenceService';

// New centralized API client
export { ApiClient, apiClient, api } from './api';
export { ApiError, NetworkError } from './api';

// Types from legacy services
export type {
  ApiTokenCredentials,
  OAuthStartResponse,
  AuthResponse,
  OAuthCallbackRequest
} from './authService';

export type {
  JiraProject,
  JiraProjectsResponse,
  JiraProjectDetailsResponse
} from './jiraService';

export type {
  ConfluenceSpace,
  ConfluenceContent,
  ConfluenceSpacesResponse,
  ConfluenceSpaceDetailsResponse,
  ConfluenceContentResponse
} from './confluenceService';

// Types from new API client
export type {
  APITokenRequest,
  HTTPValidationError,
  ApiResponse,
  ApiClientConfig,
} from './api';
