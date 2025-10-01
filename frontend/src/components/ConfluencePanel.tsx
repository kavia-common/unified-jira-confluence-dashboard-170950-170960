'use client';

import { useState, useEffect } from 'react';
import OAuthPanel from './auth/OAuthPanel';
import ApiTokenForm from './auth/ApiTokenForm';
import AuthStatus from './auth/AuthStatus';
import { ConfluenceSpaceDisplay, ConfluenceContentDisplay } from './data';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

// PUBLIC_INTERFACE
export default function ConfluencePanel() {
  /**
   * Confluence panel component that handles authentication and displays space data.
   * Uses the new authentication and app contexts for state management.
   */
  const [authMethod, setAuthMethod] = useState<'oauth' | 'token'>('oauth');
  const [selectedSpaceKey, setSelectedSpaceKey] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'spaces' | 'content'>('spaces');
  const auth = useAuth();
  const app = useApp();

  const handleAuthSuccess = async () => {
    try {
      // Load Confluence spaces after successful authentication
      await app.loadConfluenceSpaces();
    } catch (error) {
      console.error('Failed to load spaces after authentication:', error);
    }
  };

  const handleAuthError = (error: string) => {
    console.error('Authentication error:', error);
    app.addNotification({
      type: 'error',
      title: 'Authentication Failed',
      message: error,
      duration: 5000,
    });
  };

  const handleDisconnect = async () => {
    try {
      await auth.logoutConfluence();
      app.resetConfluenceData();
      setSelectedSpaceKey(null);
      setViewMode('spaces');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSpaceSelect = async (spaceKey: string) => {
    setSelectedSpaceKey(spaceKey);
    setViewMode('content');
    try {
      await app.loadConfluenceSpaceContent(spaceKey);
    } catch (error) {
      console.error('Failed to load space content:', error);
    }
  };

  const handleBackToSpaces = () => {
    setSelectedSpaceKey(null);
    setViewMode('spaces');
  };

  // Load spaces when authenticated
  useEffect(() => {
    if (auth.state.confluence.isAuthenticated && app.state.confluence.spaces.length === 0) {
      app.loadConfluenceSpaces();
    }
  }, [auth.state.confluence.isAuthenticated, app.state.confluence.spaces.length, app]);

  if (auth.state.confluence.isAuthenticated) {
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
          isConnected={auth.state.confluence.isAuthenticated}
          userInfo={auth.state.confluence.user || undefined}
          onDisconnect={handleDisconnect}
        />

        {viewMode === 'spaces' ? (
          <ConfluenceSpaceDisplay
            spaces={app.state.confluence.spaces}
            isLoading={app.state.confluence.isLoading}
            error={app.state.confluence.error}
            onRefresh={app.loadConfluenceSpaces}
            onSpaceSelect={handleSpaceSelect}
          />
        ) : (
          <ConfluenceContentDisplay
            content={app.state.confluence.spaceContent}
            isLoading={app.state.confluence.isLoading}
            error={app.state.confluence.error}
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
        isConnected={auth.state.confluence.isAuthenticated}
        onDisconnect={handleDisconnect}
      />

      {auth.state.confluence.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          <div className="flex justify-between items-start">
            <span>{auth.state.confluence.error}</span>
            <button
              onClick={auth.clearConfluenceError}
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
