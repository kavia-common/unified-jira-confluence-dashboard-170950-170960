// PUBLIC_INTERFACE
/**
 * Services barrel export file.
 * Provides centralized exports for all API service classes.
 */

export { AuthService } from './authService';
export { JiraService } from './jiraService';
export { ConfluenceService } from './confluenceService';

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
