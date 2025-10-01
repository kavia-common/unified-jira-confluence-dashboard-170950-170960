'use client';

import { useState } from 'react';
import { JiraProject } from '../../hooks/useJiraData';
import Loading from '../Loading';

interface JiraProjectDisplayProps {
  projects: JiraProject[];
  isLoading: boolean;
  error: string | null;
  onRefresh?: () => void;
}

// PUBLIC_INTERFACE
export default function JiraProjectDisplay({ 
  projects, 
  isLoading, 
  error, 
  onRefresh 
}: JiraProjectDisplayProps) {
  /**
   * Component for displaying Jira projects with enhanced UI and Ocean Professional theme styling.
   * Includes loading states, error handling, and interactive project cards.
   */
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="data-display-container">
        <div className="data-header">
          <h3 className="data-title">Jira Projects</h3>
          <p className="data-subtitle">Loading your projects...</p>
        </div>
        <Loading message="Fetching Jira projects..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="data-display-container">
        <div className="data-header">
          <h3 className="data-title">Jira Projects</h3>
          <p className="data-subtitle text-red-600">Failed to load projects</p>
        </div>
        <div className="error-state">
          <div className="error-icon">
            <svg className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="error-message">{error}</p>
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="retry-button"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="data-display-container">
        <div className="data-header">
          <h3 className="data-title">Jira Projects</h3>
          <p className="data-subtitle">No projects available</p>
        </div>
        <div className="empty-state">
          <div className="empty-icon">
            <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="empty-title">No Projects Found</h4>
          <p className="empty-description">
            You may not have access to any projects or they haven&apos;t been created yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="data-display-container">
      <div className="data-header">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="data-title">Jira Projects</h3>
            <p className="data-subtitle">
              {projects.length} project{projects.length !== 1 ? 's' : ''} available
            </p>
          </div>
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="refresh-button"
              title="Refresh projects"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="data-grid">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className={`data-card ${expandedProject === project.id ? 'expanded' : ''}`}
          >
            <div className="data-card-header">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <div className="project-avatar">
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="data-card-title truncate">{project.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="project-key">{project.key}</span>
                        <span className="project-type">{project.projectTypeKey}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedProject(
                    expandedProject === project.id ? null : project.id
                  )}
                  className="expand-button"
                  aria-label={expandedProject === project.id ? 'Collapse' : 'Expand'}
                >
                  <svg 
                    className={`h-5 w-5 transition-transform ${
                      expandedProject === project.id ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {project.description && (
              <div className="data-card-content">
                <p className="project-description">{project.description}</p>
              </div>
            )}

            {expandedProject === project.id && (
              <div className="data-card-expanded">
                <div className="expanded-content">
                  <div className="expanded-grid">
                    <div className="expanded-item">
                      <span className="expanded-label">Project ID:</span>
                      <span className="expanded-value">{project.id}</span>
                    </div>
                    <div className="expanded-item">
                      <span className="expanded-label">Project Key:</span>
                      <span className="expanded-value">{project.key}</span>
                    </div>
                    <div className="expanded-item">
                      <span className="expanded-label">Type:</span>
                      <span className="expanded-value">{project.projectTypeKey}</span>
                    </div>
                    {project.lead && (
                      <>
                        <div className="expanded-item">
                          <span className="expanded-label">Lead:</span>
                          <span className="expanded-value">{project.lead.displayName}</span>
                        </div>
                        <div className="expanded-item">
                          <span className="expanded-label">Email:</span>
                          <span className="expanded-value">{project.lead.emailAddress}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
