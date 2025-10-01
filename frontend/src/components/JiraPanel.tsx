'use client';

import { useState, useEffect } from 'react';
import OAuthPanel from './auth/OAuthPanel';
import ApiTokenForm from './auth/ApiTokenForm';
import AuthStatus from './auth/AuthStatus';
import { JiraProjectDisplay } from './data';
import { useAuth, AuthCredentials } from '../hooks/useAuth';
import { useJiraData } from '../hooks/useJiraData';

// PUBLIC_INTERFACE
export default function JiraPanel() {
  /**
   * Jira panel component that handles authentication and displays project data.
   * Uses the new authentication components and state management hooks.
   */
  const [authMethod, setAuthMethod] = useState<'oauth' | 'token'>('oauth');
  const { authState, login, logout, clearError } = useAuth('jira');
  const { projects, isLoading: projectsLoading, error: dataError, fetchProjects } = useJiraData();

  const handleAuthSuccess = async (data: AuthCredentials) => {
    try {
      await login('jira', data);
      await fetchProjects();
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
      await logout('jira');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Fetch projects when authenticated
  useEffect(() => {
    if (authState.isAuthenticated && projects.length === 0) {
      fetchProjects();
    }
  }, [authState.isAuthenticated, projects.length, fetchProjects]);

  if (authState.isAuthenticated) {
    return (
      <div className="content-card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="card-title">Jira Projects</h2>
              <p className="card-description">
                View and manage your Jira projects
              </p>
            </div>
          </div>
        </div>

        <AuthStatus 
          service="jira"
          isConnected={authState.isAuthenticated}
          userInfo={authState.user || undefined}
          onDisconnect={handleDisconnect}
        />

        <JiraProjectDisplay
          projects={projects}
          isLoading={projectsLoading}
          error={dataError}
          onRefresh={fetchProjects}
        />
      </div>
    );
  }

  return (
    <div className="content-card">
      <div className="card-header">
        <h2 className="card-title">Connect to Jira</h2>
        <p className="card-description">
          Choose your preferred authentication method to connect to your Jira workspace
        </p>
      </div>

      <AuthStatus 
        service="jira"
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
            service="jira"
            onSuccess={handleAuthSuccess}
            onError={handleAuthError}
          />
        ) : (
          <ApiTokenForm 
            service="jira"
            onSuccess={handleAuthSuccess}
            onError={handleAuthError}
          />
        )}
      </div>
    </div>
  );
}
