'use client';

// PUBLIC_INTERFACE
/**
 * OAuth utility functions for handling OAuth flows and URL parameters.
 */

export interface OAuthCallbackParams {
  code: string | null;
  state: string | null;
  error?: string | null;
  error_description?: string | null;
}

export function getOAuthCallbackParams(): OAuthCallbackParams {
  /**
   * Extract OAuth callback parameters from the current URL.
   * Returns the authorization code, state, and any error information.
   */
  if (typeof window === 'undefined') {
    return { code: null, state: null };
  }

  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    code: urlParams.get('code'),
    state: urlParams.get('state'),
    error: urlParams.get('error'),
    error_description: urlParams.get('error_description'),
  };
}

export function clearOAuthFromUrl(): void {
  /**
   * Clean up OAuth parameters from the URL after processing.
   * This helps maintain a clean URL state.
   */
  if (typeof window === 'undefined') {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.delete('code');
  url.searchParams.delete('state');
  url.searchParams.delete('error');
  url.searchParams.delete('error_description');
  
  window.history.replaceState({}, document.title, url.pathname + url.search);
}

export function storeOAuthState(service: 'jira' | 'confluence', state: string): void {
  /**
   * Store OAuth state parameter for validation during callback.
   */
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(`${service}_oauth_state`, state);
}

export function getStoredOAuthState(service: 'jira' | 'confluence'): string | null {
  /**
   * Retrieve stored OAuth state parameter.
   */
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(`${service}_oauth_state`);
}

export function clearStoredOAuthState(service: 'jira' | 'confluence'): void {
  /**
   * Clear stored OAuth state parameter after successful authentication.
   */
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(`${service}_oauth_state`);
}

export function validateOAuthState(service: 'jira' | 'confluence', receivedState: string): boolean {
  /**
   * Validate that the received OAuth state matches the stored state.
   * This is a security measure to prevent CSRF attacks.
   */
  const storedState = getStoredOAuthState(service);
  return storedState !== null && storedState === receivedState;
}
