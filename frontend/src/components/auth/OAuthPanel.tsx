'use client';

import { useState } from 'react';

import { type AuthCredentials } from '../../hooks/useAuth';

interface OAuthPanelProps {
  service: 'jira' | 'confluence';
  onSuccess: (data: AuthCredentials) => void;
  onError: (error: string) => void;
}

// PUBLIC_INTERFACE
export default function OAuthPanel({ service, onSuccess, onError }: OAuthPanelProps) {
  /**
   * OAuth panel component for handling OAuth 2.0 authentication flows
   * for Jira and Confluence services.
   * Note: onSuccess is used by the parent component after OAuth redirect completes.
   */
  const [isLoading, setIsLoading] = useState(false);
  
  // Suppress unused vars warning - onSuccess is used by parent after OAuth callback
  void onSuccess;

  const handleOAuthConnect = async () => {
    setIsLoading(true);
    
    try {
      // Use the backend API endpoint directly
      const response = await fetch(`https://vscode-internal-17271-beta.beta01.cloud.kavia.ai:3001/auth/${service}/oauth/start`);
      const data = await response.json();
      
      if (data.auth_url) {
        // Store the OAuth state for validation when returning
        localStorage.setItem(`${service}_oauth_state`, data.state);
        // Redirect to OAuth provider
        window.location.href = data.auth_url;
        // Note: onSuccess will be called by the useAuth hook after OAuth callback
      } else {
        throw new Error('No authorization URL received');
      }
    } catch (err) {
      const errorMessage = `Failed to start ${service} OAuth flow`;
      onError(errorMessage);
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
        The most secure way to connect. You&apos;ll be redirected to Atlassian to authorize access to your {serviceName} workspace.
      </p>
      
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">
              Why OAuth 2.0?
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              OAuth provides secure access without sharing your password. You can revoke access at any time from your Atlassian account settings.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleOAuthConnect}
        disabled={isLoading}
        className="button button-primary w-full flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </>
        ) : (
          <>
            <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
            Connect with {serviceName}
          </>
        )}
      </button>
    </div>
  );
}
