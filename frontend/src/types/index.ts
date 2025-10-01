// PUBLIC_INTERFACE
/**
 * Centralized type definitions for the application.
 * Types are aligned with backend OpenAPI specifications and include frontend-specific types.
 */

// Re-export API types
export type {
  APITokenRequest,
  AuthResponse,
  OAuthStartResponse,
  OAuthCallbackRequest,
  HTTPValidationError,
  JiraProject,
  ConfluenceSpace,
  ConfluenceContent,
  ApiResponse,
  ApiClientConfig,
} from '../services/api';

// Re-export context types
export type {
  AuthState,
  User,
  AuthContextValue,
  AppState,
  JiraData,
  ConfluenceData,
  UIState,
  Notification,
  AppContextValue,
} from '../contexts';

// Additional frontend-specific types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ServiceConnection {
  isConnected: boolean;
  lastValidated: Date | null;
  user?: {
    email?: string;
    displayName?: string;
    domain?: string;
    accountId?: string;
    avatarUrl?: string;
  };
}

export interface DashboardState {
  selectedService: 'jira' | 'confluence' | null;
  sidebarExpanded: boolean;
  theme: 'light' | 'dark';
}

// Form types
export interface ApiTokenFormData {
  domain: string;
  email: string;
  apiToken: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

// Event types
export interface ServiceSelectionEvent {
  service: 'jira' | 'confluence';
  timestamp: Date;
}

export interface AuthenticationEvent {
  service: 'jira' | 'confluence';
  method: 'oauth' | 'api-token';
  success: boolean;
  timestamp: Date;
  error?: string;
}

// Utility types
export type ServiceType = 'jira' | 'confluence';
export type AuthMethod = 'oauth' | 'api-token';
export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export type ThemeType = 'light' | 'dark';

// Component-specific types
export interface PanelProps extends ComponentProps {
  title: string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export interface DataDisplayProps extends ComponentProps {
  data: unknown[];
  isLoading: boolean;
  error: string | null;
  emptyMessage?: string;
  onRefresh?: () => void;
}

export interface AuthFormProps extends ComponentProps {
  service: ServiceType;
  onSuccess: () => void;
  onError: (error: string) => void;
}

// Hook return types
export interface UseServiceDataReturn<T> {
  data: T[];
  selectedItem: T | null;
  isLoading: boolean;
  error: string | null;
  loadData: () => Promise<void>;
  selectItem: (item: T | null) => void;
  clearError: () => void;
  refresh: () => Promise<void>;
}

export interface UseNotificationsReturn {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// API Error types
export interface ApiErrorDetails {
  message: string;
  status: number;
  statusText: string;
  data?: unknown;
  timestamp: Date;
}

// Configuration types
export interface AppConfig {
  apiBaseUrl: string;
  oauthRedirectUrl: string;
  theme: {
    primary: string;
    secondary: string;
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  features: {
    enableOAuth: boolean;
    enableApiToken: boolean;
    enableNotifications: boolean;
    enableThemeToggle: boolean;
  };
}
