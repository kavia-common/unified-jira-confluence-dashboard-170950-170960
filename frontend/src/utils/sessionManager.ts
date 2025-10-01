'use client';

// PUBLIC_INTERFACE
/**
 * Session management utility for handling authentication tokens and session data.
 * Provides secure storage and retrieval of session information.
 */

export interface SessionData {
  sessionId: string;
  service: 'jira' | 'confluence';
  user?: {
    email?: string;
    displayName?: string;
    domain?: string;
    accountId?: string;
    avatarUrl?: string;
  };
  expiresAt?: number;
  createdAt: number;
}

export class SessionManager {
  private static readonly SESSION_KEY_PREFIX = 'atlassian_session_';
  private static readonly OAUTH_STATE_PREFIX = 'oauth_state_';

  /**
   * Store session data for a service
   */
  static storeSession(service: 'jira' | 'confluence', sessionData: Omit<SessionData, 'service' | 'createdAt'>): void {
    try {
      const data: SessionData = {
        ...sessionData,
        service,
        createdAt: Date.now(),
      };
      
      localStorage.setItem(
        `${this.SESSION_KEY_PREFIX}${service}`,
        JSON.stringify(data)
      );
    } catch (error) {
      console.warn('Failed to store session data:', error);
    }
  }

  /**
   * Retrieve session data for a service
   */
  static getSession(service: 'jira' | 'confluence'): SessionData | null {
    try {
      const stored = localStorage.getItem(`${this.SESSION_KEY_PREFIX}${service}`);
      if (!stored) return null;

      const data: SessionData = JSON.parse(stored);
      
      // Check if session has expired
      if (data.expiresAt && Date.now() > data.expiresAt) {
        this.clearSession(service);
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Failed to retrieve session data:', error);
      return null;
    }
  }

  /**
   * Clear session data for a service
   */
  static clearSession(service: 'jira' | 'confluence'): void {
    try {
      localStorage.removeItem(`${this.SESSION_KEY_PREFIX}${service}`);
    } catch (error) {
      console.warn('Failed to clear session data:', error);
    }
  }

  /**
   * Clear all session data
   */
  static clearAllSessions(): void {
    this.clearSession('jira');
    this.clearSession('confluence');
  }

  /**
   * Check if a service has a valid session
   */
  static hasValidSession(service: 'jira' | 'confluence'): boolean {
    return this.getSession(service) !== null;
  }

  /**
   * Store OAuth state for validation
   */
  static storeOAuthState(service: 'jira' | 'confluence', state: string): void {
    try {
      localStorage.setItem(`${this.OAUTH_STATE_PREFIX}${service}`, state);
    } catch (error) {
      console.warn('Failed to store OAuth state:', error);
    }
  }

  /**
   * Retrieve and validate OAuth state
   */
  static validateOAuthState(service: 'jira' | 'confluence', state: string): boolean {
    try {
      const stored = localStorage.getItem(`${this.OAUTH_STATE_PREFIX}${service}`);
      return stored === state;
    } catch (error) {
      console.warn('Failed to validate OAuth state:', error);
      return false;
    }
  }

  /**
   * Clear OAuth state
   */
  static clearOAuthState(service: 'jira' | 'confluence'): void {
    try {
      localStorage.removeItem(`${this.OAUTH_STATE_PREFIX}${service}`);
    } catch (error) {
      console.warn('Failed to clear OAuth state:', error);
    }
  }

  /**
   * Get all stored sessions
   */
  static getAllSessions(): { jira: SessionData | null; confluence: SessionData | null } {
    return {
      jira: this.getSession('jira'),
      confluence: this.getSession('confluence'),
    };
  }

  /**
   * Update user info for an existing session
   */
  static updateSessionUser(service: 'jira' | 'confluence', user: SessionData['user']): void {
    const session = this.getSession(service);
    if (session) {
      this.storeSession(service, {
        ...session,
        user,
      });
    }
  }

  /**
   * Extend session expiration
   */
  static extendSession(service: 'jira' | 'confluence', extensionMs: number = 24 * 60 * 60 * 1000): void {
    const session = this.getSession(service);
    if (session) {
      this.storeSession(service, {
        ...session,
        expiresAt: Date.now() + extensionMs,
      });
    }
  }

  /**
   * Check if session is close to expiry (within 1 hour)
   */
  static isSessionNearExpiry(service: 'jira' | 'confluence'): boolean {
    const session = this.getSession(service);
    if (!session || !session.expiresAt) return false;

    const oneHour = 60 * 60 * 1000;
    return (session.expiresAt - Date.now()) < oneHour;
  }
}
