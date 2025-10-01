'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface OAuthPanelProps {
  service: 'jira' | 'confluence';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// PUBLIC_INTERFACE
export default function OAuthPanel({ service, onSuccess, onError }: OAuthPanelProps) {
  /**
   * OAuth panel component for handling OAuth 2.0 authentication flows
   * for Jira and Confluence services using the auth context.
   */
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();

  const handleOAuthConnect = async () => {
    setIsLoading(true);

    try {
      if (service === 'jira') {
        await auth.loginJiraWithOAuth();
      } else {
        await auth.loginConfluenceWithOAuth();
      }

      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to start ${service} OAuth flow`;
      onError?.(errorMessage);
      console.error('OAuth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const serviceName = service === 'jira' ? 'Jira' : 'Confluence';

  return (
    <div className="oauth-panel">
      <h3 className="text-lg font-medium mb-4">OAuth 2.0 Authentication</h3>
      <p className="text-gray-600 mb-6">
        Authenticate securely with OAuth 2.0. You will be redirected to Atlassian to authorize access to your {serviceName} workspace.
      </p>

      <button
        onClick={handleOAuthConnect}
        disabled={isLoading}
        className="button button-primary w-full flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </>
        ) : (
          <>Connect with {serviceName}</>
        )}
      </button>
    </div>
  );
}
