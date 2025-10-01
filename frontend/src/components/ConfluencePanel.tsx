'use client';

import { useState, useEffect } from 'react';
import OAuthPanel from './auth/OAuthPanel';
import ApiTokenForm from './auth/ApiTokenForm';
import AuthStatus from './auth/AuthStatus';
import { useAuth, type AuthCredentials } from '../hooks/useAuth';
import { useConfluenceData } from '../hooks/useConfluenceData';

// PUBLIC_INTERFACE
export default function ConfluencePanel() {
  /**
   * Confluence panel component that handles authentication and displays space data.
   * Uses the new authentication components and state management hooks.
   */
  const [authMethod, setAuthMethod] = useState<'oauth' | 'token'>('oauth');
  const { authState, login, logout, clearError } = useAuth('confluence');
  const { spaces, isLoading: spacesLoading, fetchSpaces } = useConfluenceData();

  const handleAuthSuccess = async (data: AuthCredentials) => {
    try {
      await login('confluence', data);
      await fetchSpaces();
    } catch (error) {
      console.error('Authentication success handler error:', error);
    }
  };

  const handleAuthError = (error: string) => {
    console.error('Authentication error:', error);
    // Error is automatically handled by the auth components
  };

  const handleDisconnect = async () => {
    try {
      await logout('confluence');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Fetch spaces when authenticated
  useEffect(() => {
    if (authState.isAuthenticated && spaces.length === 0) {
      fetchSpaces();
    }
  }, [authState.isAuthenticated, spaces.length, fetchSpaces]);

  if (authState.isAuthenticated) {
    return (
      <div className="content-card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="card-title">Confluence Spaces</h2>
              <p className="card-description">
                View and manage your Confluence spaces
              </p>
            </div>
          </div>
        </div>

        <AuthStatus 
          service="confluence"
          isConnected={authState.isAuthenticated}
          userInfo={authState.user || undefined}
          onDisconnect={handleDisconnect}
        />

        {spacesLoading ? (
          <div className="flex items-center justify-center py-8">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-2 text-gray-600">Loading spaces...</span>
          </div>
        ) : spaces.length > 0 ? (
          <div className="project-list mt-6">
            {spaces.map((space) => (
              <div key={space.id} className="project-item">
                <div className="project-name">{space.name}</div>
                <div className="project-key">
                  {space.key} • {space.type}
                </div>
                {space.description?.plain?.value && (
                  <p className="text-sm text-gray-500 mt-1">{space.description.plain.value}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="mt-2">No spaces found</p>
            <p className="text-sm">You may not have access to any spaces or they haven&apos;t loaded yet.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="content-card">
      <div className="card-header">
        <h2 className="card-title">Connect to Confluence</h2>
        <p className="card-description">
          Choose your preferred authentication method to connect to your Confluence workspace
        </p>
      </div>

      <AuthStatus 
        service="confluence"
        isConnected={authState.isAuthenticated}
        onDisconnect={handleDisconnect}
      />

      {authState.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          <div className="flex justify-between items-start">
            <span>{authState.error}</span>
            <button
              onClick={clearError}
              className="text-red-700 hover:text-red-900 ml-2"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Authentication Method Selector */}
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            className={`pb-2 px-1 border-b-2 transition-colors ${
              authMethod === 'oauth'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500'
            }`}
            onClick={() => setAuthMethod('oauth')}
          >
            OAuth 2.0 (Recommended)
          </button>
          <button
            className={`pb-2 px-1 border-b-2 transition-colors ${
              authMethod === 'token'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500'
            }`}
            onClick={() => setAuthMethod('token')}
          >
            API Token
          </button>
        </div>

        {authMethod === 'oauth' ? (
          <OAuthPanel 
            service="confluence"
            onSuccess={handleAuthSuccess}
            onError={handleAuthError}
          />
        ) : (
          <ApiTokenForm 
            service="confluence"
            onSuccess={handleAuthSuccess}
            onError={handleAuthError}
          />
        )}
      </div>
    </div>
  );
}
