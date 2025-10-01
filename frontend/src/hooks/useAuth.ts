'use client';

import { useState, useCallback, useEffect } from 'react';

export interface AuthUser {
  email?: string;
  displayName?: string;
  domain?: string;
  sessionId?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthCredentials {
  success: boolean;
  message: string;
  session_id?: string;
  user_info?: AuthUser;
  [key: string]: unknown;
}

export interface UseAuthReturn {
  authState: AuthState;
  login: (service: 'jira' | 'confluence', credentials: AuthCredentials) => Promise<void>;
  logout: (service: 'jira' | 'confluence') => Promise<void>;
  validateConnection: (service: 'jira' | 'confluence') => Promise<boolean>;
  clearError: () => void;
}

// PUBLIC_INTERFACE
export function useAuth(service: 'jira' | 'confluence'): UseAuthReturn {
  /**
   * Authentication state management hook for handling login, logout,
   * and connection validation for Jira and Confluence services.
   */
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,
  });

  const clearError = useCallback(() => {
    setAuthState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  const login = useCallback(async (authService: 'jira' | 'confluence', credentials: AuthCredentials) => {
    setAuthState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // This should be handled by the auth components
      // The hook just manages the state after successful authentication
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: credentials.user_info || null,
        isLoading: false,
      }));
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async (authService: 'jira' | 'confluence') => {
    setAuthState(prev => ({
      ...prev,
      isLoading: true,
    }));

    try {
      // Call logout endpoint
      const response = await fetch('https://vscode-internal-17271-beta.beta01.cloud.kavia.ai:3001/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null,
        });
        
        // Clear any stored OAuth state
        localStorage.removeItem(`${authService}_oauth_state`);
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Logout failed',
      }));
      throw error;
    }
  }, []);

  const validateConnection = useCallback(async (authService: 'jira' | 'confluence'): Promise<boolean> => {
    try {
      const response = await fetch(`https://vscode-internal-17271-beta.beta01.cloud.kavia.ai:3001/${authService}/connection/validate`, {
        credentials: 'include',
      });

      return response.ok;
    } catch (error) {
      console.error('Connection validation failed:', error);
      return false;
    }
  }, []);

  // Check for OAuth callback on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const storedState = localStorage.getItem(`${service}_oauth_state`);

    if (code && state && state === storedState) {
      // Handle OAuth callback
      const handleOAuthCallback = async () => {
        setAuthState(prev => ({ ...prev, isLoading: true }));

        try {
          const response = await fetch(`https://vscode-internal-17271-beta.beta01.cloud.kavia.ai:3001/auth/${service}/oauth/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ code, state }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            setAuthState({
              isAuthenticated: true,
              user: data.user_info || null,
              isLoading: false,
              error: null,
            });
            
            // Clean up URL and stored state
            localStorage.removeItem(`${service}_oauth_state`);
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            throw new Error(data.message || 'OAuth callback failed');
          }
        } catch (error) {
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: error instanceof Error ? error.message : 'OAuth callback failed',
          });
        }
      };

      handleOAuthCallback();
    }
  }, [service]);

  return {
    authState,
    login,
    logout,
    validateConnection,
    clearError,
  };
}
