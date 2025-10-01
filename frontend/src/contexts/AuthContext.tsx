'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { api, APITokenRequest, OAuthCallbackRequest } from '../services/api';

// Authentication state types
export interface User {
  email?: string;
  displayName?: string;
  domain?: string;
  accountId?: string;
  avatarUrl?: string;
  [key: string]: unknown;
}

export interface AuthState {
  // Jira authentication state
  jira: {
    isAuthenticated: boolean;
    user: User | null;
    sessionId: string | null;
    isLoading: boolean;
    error: string | null;
  };
  // Confluence authentication state
  confluence: {
    isAuthenticated: boolean;
    user: User | null;
    sessionId: string | null;
    isLoading: boolean;
    error: string | null;
  };
  // Global loading state
  isInitializing: boolean;
}

// Action types
type AuthAction =
  | { type: 'INIT_START' }
  | { type: 'INIT_COMPLETE' }
  | { type: 'JIRA_LOGIN_START' }
  | { type: 'JIRA_LOGIN_SUCCESS'; payload: { user: User | null; sessionId: string | null } }
  | { type: 'JIRA_LOGIN_ERROR'; payload: { error: string } }
  | { type: 'JIRA_LOGOUT' }
  | { type: 'JIRA_CLEAR_ERROR' }
  | { type: 'CONFLUENCE_LOGIN_START' }
  | { type: 'CONFLUENCE_LOGIN_SUCCESS'; payload: { user: User | null; sessionId: string | null } }
  | { type: 'CONFLUENCE_LOGIN_ERROR'; payload: { error: string } }
  | { type: 'CONFLUENCE_LOGOUT' }
  | { type: 'CONFLUENCE_CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
  jira: {
    isAuthenticated: false,
    user: null,
    sessionId: null,
    isLoading: false,
    error: null,
  },
  confluence: {
    isAuthenticated: false,
    user: null,
    sessionId: null,
    isLoading: false,
    error: null,
  },
  isInitializing: true,
};

// Reducer function
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'INIT_START':
      return { ...state, isInitializing: true };
    
    case 'INIT_COMPLETE':
      return { ...state, isInitializing: false };

    case 'JIRA_LOGIN_START':
      return {
        ...state,
        jira: { ...state.jira, isLoading: true, error: null },
      };

    case 'JIRA_LOGIN_SUCCESS':
      return {
        ...state,
        jira: {
          ...state.jira,
          isAuthenticated: true,
          user: action.payload.user,
          sessionId: action.payload.sessionId,
          isLoading: false,
          error: null,
        },
      };

    case 'JIRA_LOGIN_ERROR':
      return {
        ...state,
        jira: {
          ...state.jira,
          isAuthenticated: false,
          user: null,
          sessionId: null,
          isLoading: false,
          error: action.payload.error,
        },
      };

    case 'JIRA_LOGOUT':
      return {
        ...state,
        jira: {
          isAuthenticated: false,
          user: null,
          sessionId: null,
          isLoading: false,
          error: null,
        },
      };

    case 'JIRA_CLEAR_ERROR':
      return {
        ...state,
        jira: { ...state.jira, error: null },
      };

    case 'CONFLUENCE_LOGIN_START':
      return {
        ...state,
        confluence: { ...state.confluence, isLoading: true, error: null },
      };

    case 'CONFLUENCE_LOGIN_SUCCESS':
      return {
        ...state,
        confluence: {
          ...state.confluence,
          isAuthenticated: true,
          user: action.payload.user,
          sessionId: action.payload.sessionId,
          isLoading: false,
          error: null,
        },
      };

    case 'CONFLUENCE_LOGIN_ERROR':
      return {
        ...state,
        confluence: {
          ...state.confluence,
          isAuthenticated: false,
          user: null,
          sessionId: null,
          isLoading: false,
          error: action.payload.error,
        },
      };

    case 'CONFLUENCE_LOGOUT':
      return {
        ...state,
        confluence: {
          isAuthenticated: false,
          user: null,
          sessionId: null,
          isLoading: false,
          error: null,
        },
      };

    case 'CONFLUENCE_CLEAR_ERROR':
      return {
        ...state,
        confluence: { ...state.confluence, error: null },
      };

    default:
      return state;
  }
}

// Context value interface
export interface AuthContextValue {
  state: AuthState;
  
  // Jira methods
  loginJiraWithOAuth: () => Promise<void>;
  loginJiraWithToken: (credentials: APITokenRequest) => Promise<void>;
  handleJiraOAuthCallback: (request: OAuthCallbackRequest) => Promise<void>;
  logoutJira: () => Promise<void>;
  validateJiraConnection: () => Promise<boolean>;
  clearJiraError: () => void;
  
  // Confluence methods
  loginConfluenceWithOAuth: () => Promise<void>;
  loginConfluenceWithToken: (credentials: APITokenRequest) => Promise<void>;
  handleConfluenceOAuthCallback: (request: OAuthCallbackRequest) => Promise<void>;
  logoutConfluence: () => Promise<void>;
  validateConfluenceConnection: () => Promise<boolean>;
  clearConfluenceError: () => void;
  
  // Utility methods
  logoutAll: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// PUBLIC_INTERFACE
export function AuthProvider({ children }: { children: ReactNode }) {
  /**
   * Authentication context provider that manages Jira and Confluence authentication state.
   * Provides methods for OAuth and API token authentication, session management, and connection validation.
   */
  
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize authentication state on mount
  useEffect(() => {
    const initialize = async () => {
      dispatch({ type: 'INIT_START' });
      
      try {
        // Check for existing connections by validating them
        const [jiraValid, confluenceValid] = await Promise.all([
          api.validateJiraConnection(),
          api.validateConfluenceConnection(),
        ]);

        if (jiraValid) {
          // If Jira connection is valid, assume user is authenticated
          // In a real app, you might want to fetch user info here
          dispatch({
            type: 'JIRA_LOGIN_SUCCESS',
            payload: { user: null, sessionId: null },
          });
        }

        if (confluenceValid) {
          // If Confluence connection is valid, assume user is authenticated
          dispatch({
            type: 'CONFLUENCE_LOGIN_SUCCESS',
            payload: { user: null, sessionId: null },
          });
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
      } finally {
        dispatch({ type: 'INIT_COMPLETE' });
      }
    };

    initialize();
  }, []);

  // Handle OAuth callback on mount
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');

      if (!code || !state) return;

      // Check which service this callback is for
      const jiraState = localStorage.getItem('jira_oauth_state');
      const confluenceState = localStorage.getItem('confluence_oauth_state');

      try {
        if (state === jiraState) {
          await handleJiraOAuthCallback({ code, state });
          localStorage.removeItem('jira_oauth_state');
        } else if (state === confluenceState) {
          await handleConfluenceOAuthCallback({ code, state });
          localStorage.removeItem('confluence_oauth_state');
        }

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('OAuth callback error:', error);
      }
    };

    handleOAuthCallback();
  }, []);

  // Jira authentication methods
  const loginJiraWithOAuth = async (): Promise<void> => {
    dispatch({ type: 'JIRA_LOGIN_START' });
    
    try {
      const response = await api.startJiraOAuth();
      
      // Store state for validation
      localStorage.setItem('jira_oauth_state', response.state);
      
      // Redirect to OAuth URL
      window.location.href = response.auth_url;
    } catch (error) {
      dispatch({
        type: 'JIRA_LOGIN_ERROR',
        payload: { error: error instanceof Error ? error.message : 'OAuth initialization failed' },
      });
      throw error;
    }
  };

  const loginJiraWithToken = async (credentials: APITokenRequest): Promise<void> => {
    dispatch({ type: 'JIRA_LOGIN_START' });
    
    try {
      const response = await api.authenticateJiraWithToken(credentials);
      
      if (response.success) {
        dispatch({
          type: 'JIRA_LOGIN_SUCCESS',
          payload: {
            user: response.user_info || null,
            sessionId: response.session_id || null,
          },
        });
      } else {
        throw new Error(response.message || 'Authentication failed');
      }
    } catch (error) {
      dispatch({
        type: 'JIRA_LOGIN_ERROR',
        payload: { error: error instanceof Error ? error.message : 'Authentication failed' },
      });
      throw error;
    }
  };

  const handleJiraOAuthCallback = async (request: OAuthCallbackRequest): Promise<void> => {
    dispatch({ type: 'JIRA_LOGIN_START' });
    
    try {
      const response = await api.handleJiraOAuthCallback(request);
      
      if (response.success) {
        dispatch({
          type: 'JIRA_LOGIN_SUCCESS',
          payload: {
            user: response.user_info || null,
            sessionId: response.session_id || null,
          },
        });
      } else {
        throw new Error(response.message || 'OAuth callback failed');
      }
    } catch (error) {
      dispatch({
        type: 'JIRA_LOGIN_ERROR',
        payload: { error: error instanceof Error ? error.message : 'OAuth callback failed' },
      });
      throw error;
    }
  };

  const logoutJira = async (): Promise<void> => {
    try {
      await api.logout(state.jira.sessionId || undefined);
    } catch (error) {
      console.error('Jira logout error:', error);
    } finally {
      dispatch({ type: 'JIRA_LOGOUT' });
    }
  };

  const validateJiraConnection = async (): Promise<boolean> => {
    return api.validateJiraConnection();
  };

  const clearJiraError = (): void => {
    dispatch({ type: 'JIRA_CLEAR_ERROR' });
  };

  // Confluence authentication methods
  const loginConfluenceWithOAuth = async (): Promise<void> => {
    dispatch({ type: 'CONFLUENCE_LOGIN_START' });
    
    try {
      const response = await api.startConfluenceOAuth();
      
      // Store state for validation
      localStorage.setItem('confluence_oauth_state', response.state);
      
      // Redirect to OAuth URL
      window.location.href = response.auth_url;
    } catch (error) {
      dispatch({
        type: 'CONFLUENCE_LOGIN_ERROR',
        payload: { error: error instanceof Error ? error.message : 'OAuth initialization failed' },
      });
      throw error;
    }
  };

  const loginConfluenceWithToken = async (credentials: APITokenRequest): Promise<void> => {
    dispatch({ type: 'CONFLUENCE_LOGIN_START' });
    
    try {
      const response = await api.authenticateConfluenceWithToken(credentials);
      
      if (response.success) {
        dispatch({
          type: 'CONFLUENCE_LOGIN_SUCCESS',
          payload: {
            user: response.user_info || null,
            sessionId: response.session_id || null,
          },
        });
      } else {
        throw new Error(response.message || 'Authentication failed');
      }
    } catch (error) {
      dispatch({
        type: 'CONFLUENCE_LOGIN_ERROR',
        payload: { error: error instanceof Error ? error.message : 'Authentication failed' },
      });
      throw error;
    }
  };

  const handleConfluenceOAuthCallback = async (request: OAuthCallbackRequest): Promise<void> => {
    dispatch({ type: 'CONFLUENCE_LOGIN_START' });
    
    try {
      const response = await api.handleConfluenceOAuthCallback(request);
      
      if (response.success) {
        dispatch({
          type: 'CONFLUENCE_LOGIN_SUCCESS',
          payload: {
            user: response.user_info || null,
            sessionId: response.session_id || null,
          },
        });
      } else {
        throw new Error(response.message || 'OAuth callback failed');
      }
    } catch (error) {
      dispatch({
        type: 'CONFLUENCE_LOGIN_ERROR',
        payload: { error: error instanceof Error ? error.message : 'OAuth callback failed' },
      });
      throw error;
    }
  };

  const logoutConfluence = async (): Promise<void> => {
    try {
      await api.logout(state.confluence.sessionId || undefined);
    } catch (error) {
      console.error('Confluence logout error:', error);
    } finally {
      dispatch({ type: 'CONFLUENCE_LOGOUT' });
    }
  };

  const validateConfluenceConnection = async (): Promise<boolean> => {
    return api.validateConfluenceConnection();
  };

  const clearConfluenceError = (): void => {
    dispatch({ type: 'CONFLUENCE_CLEAR_ERROR' });
  };

  // Utility methods
  const logoutAll = async (): Promise<void> => {
    await Promise.all([logoutJira(), logoutConfluence()]);
  };

  const contextValue: AuthContextValue = {
    state,
    
    // Jira methods
    loginJiraWithOAuth,
    loginJiraWithToken,
    handleJiraOAuthCallback,
    logoutJira,
    validateJiraConnection,
    clearJiraError,
    
    // Confluence methods
    loginConfluenceWithOAuth,
    loginConfluenceWithToken,
    handleConfluenceOAuthCallback,
    logoutConfluence,
    validateConfluenceConnection,
    clearConfluenceError,
    
    // Utility methods
    logoutAll,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth(): AuthContextValue {
  /**
   * Hook to access authentication context.
   * Must be used within an AuthProvider.
   */
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
