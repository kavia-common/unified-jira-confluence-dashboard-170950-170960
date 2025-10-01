'use client';

import { useState, useEffect } from 'react';
import OAuthPanel from './auth/OAuthPanel';
import ApiTokenForm from './auth/ApiTokenForm';
import AuthStatus from './auth/AuthStatus';
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
  const { projects, isLoading: projectsLoading, fetchProjects } = useJiraData();

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

        {projectsLoading ? (
          <div className="flex items-center justify-center py-8">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-2 text-gray-600">Loading projects...</span>
          </div>
        ) : projects.length > 0 ? (
          <div className="project-list mt-6">
            {projects.map((project) => (
              <div key={project.id} className="project-item">
                <div className="project-name">{project.name}</div>
                <div className="project-key">
                  {project.key} • {project.projectTypeKey}
                </div>
                {project.description && (
                  <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2">No projects found</p>
            <p className="text-sm">You may not have access to any projects or they haven&apos;t loaded yet.</p>
          </div>
        )}
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
