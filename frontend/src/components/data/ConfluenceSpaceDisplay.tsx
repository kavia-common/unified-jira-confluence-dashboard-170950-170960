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
            <svg className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="error-message">{error}</p>
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="button button-primary"
            >
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
            <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
              className="button button-secondary"
              title="Refresh spaces"
            >
              Refresh
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
                      className="button"
                      title="View space content"
                    >
                      View
                    </button>
                  )}
                  <button
                    onClick={() => setExpandedSpace(
                      expandedSpace === space.id ? null : space.id
                    )}
                    className="button"
                    aria-label={expandedSpace === space.id ? 'Collapse' : 'Expand'}
                  >
                    <svg 
                      className={`h-5 w-5 transition-transform ${
                        expandedSpace === space.id ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      aria-hidden="true"
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
          </div>
        ))}
      </div>
    </div>
  );
}
