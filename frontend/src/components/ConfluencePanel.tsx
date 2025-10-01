'use client';

import { useState, useEffect } from 'react';
import OAuthPanel from './auth/OAuthPanel';
import ApiTokenForm from './auth/ApiTokenForm';
import AuthStatus from './auth/AuthStatus';
import { ConfluenceSpaceDisplay, ConfluenceContentDisplay } from './data';
import { useAuth, type AuthCredentials } from '../hooks/useAuth';
import { useConfluenceData } from '../hooks/useConfluenceData';

// PUBLIC_INTERFACE
export default function ConfluencePanel() {
  /**
   * Confluence panel component that handles authentication and displays space data.
   * Uses the new authentication components and state management hooks.
   */
  const [authMethod, setAuthMethod] = useState<'oauth' | 'token'>('oauth');
  const [selectedSpaceKey, setSelectedSpaceKey] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'spaces' | 'content'>('spaces');
  const { authState, login, logout, clearError } = useAuth('confluence');
  const { spaces, content, isLoading: spacesLoading, error: dataError, fetchSpaces, fetchSpaceContent } = useConfluenceData();

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
      setSelectedSpaceKey(null);
      setViewMode('spaces');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSpaceSelect = async (spaceKey: string) => {
    setSelectedSpaceKey(spaceKey);
    setViewMode('content');
    await fetchSpaceContent(spaceKey);
  };

  const handleBackToSpaces = () => {
    setSelectedSpaceKey(null);
    setViewMode('spaces');
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

        {viewMode === 'spaces' ? (
          <ConfluenceSpaceDisplay
            spaces={spaces}
            isLoading={spacesLoading}
            error={dataError}
            onRefresh={fetchSpaces}
            onSpaceSelect={handleSpaceSelect}
          />
        ) : (
          <ConfluenceContentDisplay
            content={content}
            isLoading={spacesLoading}
            error={dataError}
            spaceKey={selectedSpaceKey || undefined}
            onBack={handleBackToSpaces}
          />
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
