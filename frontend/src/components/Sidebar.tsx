'use client';

import { useApp } from '../contexts/AppContext';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

// PUBLIC_INTERFACE
export default function Sidebar({ isMobileOpen, onCloseMobile }: SidebarProps) {
  /**
   * Sidebar component with service selection using the app context.
   * Manages the selection of Jira and Confluence services.
   */
  const app = useApp();

  const handleConnectorSelect = (connector: 'jira' | 'confluence' | null) => {
    app.selectService(connector);

    // Close mobile menu when item is selected
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      onCloseMobile();
    }
  };

  return (
    <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <h1 className="text-xl font-bold">
          Atlassian Dashboard
        </h1>
        <p className="text-sm opacity-80 mt-1">
          Connect your workspace
        </p>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${app.state.ui.selectedService === 'jira' ? 'active' : ''}`}
          onClick={() => handleConnectorSelect('jira')}
        >
          <JiraIcon className="nav-item-icon" />
          <span>Jira</span>
          {app.state.jira.projects.length > 0 && (
            <span className="ml-auto text-xs bg-green-500 text-white rounded-full px-2 py-1">
              {app.state.jira.projects.length}
            </span>
          )}
        </button>

        <button
          className={`nav-item ${app.state.ui.selectedService === 'confluence' ? 'active' : ''}`}
          onClick={() => handleConnectorSelect('confluence')}
        >
          <ConfluenceIcon className="nav-item-icon" />
          <span>Confluence</span>
          {app.state.confluence.spaces.length > 0 && (
            <span className="ml-auto text-xs bg-green-500 text-white rounded-full px-2 py-1">
              {app.state.confluence.spaces.length}
            </span>
          )}
        </button>
      </nav>
    </aside>
  );
}

// Jira Icon Component
function JiraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129V8.915A5.214 5.214 0 0 0 18.294 4.7V5.757zM11.571 0H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 12.518V1.005A1.005 1.005 0 0 0 11.571 0z"/>
    </svg>
  );
}

// Confluence Icon Component
function ConfluenceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.87 12.85c-.56-1.05-.46-2.33.25-3.3L5.39 3.2a1.98 1.98 0 0 1 3.44.2L12.97 12c.56 1.05.46 2.33-.25 3.3l-4.27 6.35a1.98 1.98 0 0 1-3.44-.2L.87 12.85zm22.26-1.7c.56 1.05.46 2.33-.25 3.3L18.61 20.8a1.98 1.98 0 0 1-3.44-.2L11.03 12c-.56-1.05-.46-2.33.25-3.3L15.55 2.35a1.98 1.98 0 0 1 3.44.2l4.14 8.6z"/>
    </svg>
  );
}
