'use client';

import { ConfluenceContent } from '../../hooks/useConfluenceData';
import Loading from '../Loading';

interface ConfluenceContentDisplayProps {
  content: ConfluenceContent[];
  isLoading: boolean;
  error: string | null;
  spaceKey?: string;
  onBack?: () => void;
}

// PUBLIC_INTERFACE
export default function ConfluenceContentDisplay({ 
  content, 
  isLoading, 
  error, 
  spaceKey,
  onBack 
}: ConfluenceContentDisplayProps) {
  /**
   * Component for displaying Confluence space content with Ocean Professional theme styling.
   * Shows pages, blogs, and other content types from a selected space.
   */

  if (isLoading) {
    return (
      <div className="data-display-container">
        <div className="data-header">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="data-title">Space Content</h3>
              <p className="data-subtitle">Loading content from {spaceKey}...</p>
            </div>
            {onBack && (
              <button onClick={onBack} className="refresh-button">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <Loading message="Fetching space content..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="data-display-container">
        <div className="data-header">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="data-title">Space Content</h3>
              <p className="data-subtitle text-red-600">Failed to load content</p>
            </div>
            {onBack && (
              <button onClick={onBack} className="refresh-button">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="error-state">
          <div className="error-icon">
            <svg className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="data-display-container">
        <div className="data-header">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="data-title">Space Content</h3>
              <p className="data-subtitle">No content found in {spaceKey}</p>
            </div>
            {onBack && (
              <button onClick={onBack} className="refresh-button">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="empty-state">
          <div className="empty-icon">
            <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="empty-title">No Content Found</h4>
          <p className="empty-description">
            This space appears to be empty or you may not have permission to view its content.
          </p>
        </div>
      </div>
    );
  }

  const getContentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'page':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'blogpost':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'current':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="data-display-container">
      <div className="data-header">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="data-title">Space Content</h3>
            <p className="data-subtitle">
              {content.length} item{content.length !== 1 ? 's' : ''} in {spaceKey}
            </p>
          </div>
          {onBack && (
            <button onClick={onBack} className="refresh-button" title="Back to spaces">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="content-list">
        {content.map((item) => (
          <div key={item.id} className="content-item">
            <div className="content-item-header">
              <div className="flex items-start space-x-3">
                <div className="content-icon">
                  {getContentIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="content-title">{item.title}</h4>
                  <div className="content-meta">
                    <span className={`content-status ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <span className="content-type">{item.type}</span>
                    <span className="content-space">{item.space.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
