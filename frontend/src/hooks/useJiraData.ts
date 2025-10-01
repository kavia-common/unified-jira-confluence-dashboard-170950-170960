'use client';

import { useState, useCallback } from 'react';

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  description?: string;
  lead?: {
    displayName: string;
    emailAddress: string;
  };
}

export interface UseJiraDataReturn {
  projects: JiraProject[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  refreshData: () => Promise<void>;
}

// PUBLIC_INTERFACE
export function useJiraData(): UseJiraDataReturn {
  /**
   * Hook for managing Jira data fetching and state management.
   * Handles projects retrieval and caching.
   */
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://vscode-internal-17271-beta.beta01.cloud.kavia.ai:3001/jira/projects', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Jira projects');
      }

      const data = await response.json();
      setProjects(data.projects || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(errorMessage);
      console.error('Failed to fetch Jira projects:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    refreshData,
  };
}
