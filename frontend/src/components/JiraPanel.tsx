'use client';

import { useState } from 'react';

interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
}

// PUBLIC_INTERFACE
export default function JiraPanel() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [authMethod, setAuthMethod] = useState<'oauth' | 'token'>('oauth');
  const [formData, setFormData] = useState({
    domain: '',
    email: '',
    apiToken: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleOAuthConnect = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // This will be connected to the backend API
      const response = await fetch('/api/auth/jira/oauth/start');
      const data = await response.json();
      
      if (data.auth_url) {
        window.location.href = data.auth_url;
      }
    } catch (err) {
      setError('Failed to start OAuth flow');
      console.error('OAuth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // This will be connected to the backend API
      const response = await fetch('/api/auth/jira/api-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsConnected(true);
        await fetchProjects();
      } else {
        throw new Error('Authentication failed');
      }
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
      console.error('Token auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      // This will be connected to the backend API
      const response = await fetch('/api/jira/projects');
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setProjects([]);
    setFormData({ domain: '', email: '', apiToken: '' });
    setError(null);
  };

  if (isConnected) {
    return (
      <div className="content-card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="card-title">Jira Projects</h2>
              <p className="card-description">
                Connected to your Jira workspace
              </p>
            </div>
            <button
              onClick={handleDisconnect}
              className="button button-secondary"
            >
              Disconnect
            </button>
          </div>
        </div>

        {projects.length > 0 ? (
          <div className="project-list">
            {projects.map((project) => (
              <div key={project.id} className="project-item">
                <div className="project-name">{project.name}</div>
                <div className="project-key">
                  {project.key} • {project.projectTypeKey}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No projects found or still loading...
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

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
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
          <div>
            <h3 className="text-lg font-medium mb-4">OAuth 2.0 Authentication</h3>
            <p className="text-gray-600 mb-6">
              The most secure way to connect. You&apos;ll be redirected to Atlassian to authorize access.
            </p>
            <button
              onClick={handleOAuthConnect}
              disabled={isLoading}
              className="button button-primary"
            >
              {isLoading ? 'Connecting...' : 'Connect with Jira'}
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-medium mb-4">API Token Authentication</h3>
            <form onSubmit={handleTokenAuth} className="space-y-4">
              <div className="form-group">
                <label htmlFor="domain" className="form-label">
                  Jira Domain
                </label>
                <input
                  type="text"
                  id="domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleInputChange}
                  placeholder="your-company.atlassian.net"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your-email@company.com"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="apiToken" className="form-label">
                  API Token
                </label>
                <input
                  type="password"
                  id="apiToken"
                  name="apiToken"
                  value={formData.apiToken}
                  onChange={handleInputChange}
                  placeholder="Your Jira API token"
                  className="form-input"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Get your API token from{' '}
                  <a
                    href="https://id.atlassian.com/manage-profile/security/api-tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Atlassian Account Settings
                  </a>
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="button button-primary"
              >
                {isLoading ? 'Connecting...' : 'Connect with API Token'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
