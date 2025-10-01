'use client';

// PUBLIC_INTERFACE
export default function WelcomePanel() {
  return (
    <div className="content-card">
      <div className="card-header">
        <h2 className="card-title">Welcome to Your Atlassian Dashboard</h2>
        <p className="card-description">
          Connect your Jira and Confluence accounts to get started. Select a service from the sidebar to begin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129V8.915A5.214 5.214 0 0 0 18.294 4.7V5.757zM11.571 0H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 12.518V1.005A1.005 1.005 0 0 0 11.571 0z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Jira Integration</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Connect to your Jira workspace to view and manage your projects, issues, and workflows.
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• View all accessible projects</li>
            <li>• OAuth 2.0 or API token authentication</li>
            <li>• Real-time project information</li>
          </ul>
        </div>

        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M.87 12.85c-.56-1.05-.46-2.33.25-3.3L5.39 3.2a1.98 1.98 0 0 1 3.44.2L12.97 12c.56 1.05.46 2.33-.25 3.3l-4.27 6.35a1.98 1.98 0 0 1-3.44-.2L.87 12.85zm22.26-1.7c.56 1.05.46 2.33-.25 3.3L18.61 20.8a1.98 1.98 0 0 1-3.44-.2L11.03 12c-.56-1.05-.46-2.33.25-3.3L15.55 2.35a1.98 1.98 0 0 1 3.44.2l4.14 8.6z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Confluence Integration</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Access your Confluence spaces and content to stay organized and collaborate effectively.
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• Browse all accessible spaces</li>
            <li>• OAuth 2.0 or API token authentication</li>
            <li>• View space content and structure</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
