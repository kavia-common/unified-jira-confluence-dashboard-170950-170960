'use client';

import { useState } from 'react';
import { ConfluenceSpace } from '../../services/api';
import Loading from '../Loading';

interface ConfluenceSpaceDisplayProps {
  spaces: ConfluenceSpace[];
  isLoading: boolean;
  error: string | null;
  onRefresh?: () => void;
  onSpaceSelect?: (spaceKey: string) => void;
}

// PUBLIC_INTERFACE
export default function ConfluenceSpaceDisplay({ 
  spaces, 
  isLoading, 
  error, 
  onRefresh,
  onSpaceSelect 
}: ConfluenceSpaceDisplayProps) {
  /**
   * Component for displaying Confluence spaces with enhanced UI and Ocean Professional theme styling.
   * Includes loading states, error handling, and interactive space cards.
   */
  const [expandedSpace, setExpandedSpace] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="data-display-container">
        <div className="data-header">
          <h3 className="data-title">Confluence Spaces</h3>
          <p className="data-subtitle">Loading your spaces...</p>
        </div>
        <Loading message="Fetching Confluence spaces..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="data-display-container">
        <div className="data-header">
          <h3 className="data-title">Confluence Spaces</h3>
          <p className="data-subtitle text-red-600">Failed to load spaces</p>
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

  if (spaces.length === 0) {
    return (
      <div className="data-display-container">
        <div className="data-header">
          <h3 className="data-title">Confluence Spaces</h3>
          <p className="data-subtitle">No spaces available</p>
        </div>
        <div className="empty-state">
          <div className="empty-icon">
            <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h4 className="empty-title">No Spaces Found</h4>
          <p className="empty-description">
            You may not have access to any spaces or they haven&apos;t been created yet.
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
            <h3 className="data-title">Confluence Spaces</h3>
            <p className="data-subtitle">
              {spaces.length} space{spaces.length !== 1 ? 's' : ''} available
            </p>
          </div>
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="refresh-button"
              title="Refresh spaces"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="data-grid">
        {spaces.map((space) => (
          <div 
            key={space.id} 
            className={`data-card ${expandedSpace === space.id ? 'expanded' : ''}`}
          >
            <div className="data-card-header">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <div className="space-avatar">
                      {space.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="data-card-title truncate">{space.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="space-key">{space.key}</span>
                        <span className="space-type">{space.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {onSpaceSelect && (
                    <button
                      onClick={() => onSpaceSelect(space.key)}
                      className="action-button"
                      title="View space content"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => setExpandedSpace(
                      expandedSpace === space.id ? null : space.id
                    )}
                    className="expand-button"
                    aria-label={expandedSpace === space.id ? 'Collapse' : 'Expand'}
                  >
                    <svg 
                      className={`h-5 w-5 transition-transform ${
                        expandedSpace === space.id ? 'rotate-180' : ''
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
            </div>

            {space.description?.plain?.value && (
              <div className="data-card-content">
                <p className="space-description">{space.description.plain.value}</p>
              </div>
            )}

            {expandedSpace === space.id && (
              <div className="data-card-expanded">
                <div className="expanded-content">
                  <div className="expanded-grid">
                    <div className="expanded-item">
                      <span className="expanded-label">Space ID:</span>
                      <span className="expanded-value">{space.id}</span>
                    </div>
                    <div className="expanded-item">
                      <span className="expanded-label">Space Key:</span>
                      <span className="expanded-value">{space.key}</span>
                    </div>
                    <div className="expanded-item">
                      <span className="expanded-label">Type:</span>
                      <span className="expanded-value">{space.type}</span>
                    </div>
                    {space.homepage && (
                      <>
                        <div className="expanded-item">
                          <span className="expanded-label">Homepage:</span>
                          <span className="expanded-value">{space.homepage.title}</span>
                        </div>
                        <div className="expanded-item">
                          <span className="expanded-label">Homepage ID:</span>
                          <span className="expanded-value">{space.homepage.id}</span>
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
