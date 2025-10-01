'use client';

import { useState, useCallback } from 'react';

export interface ConfluenceSpace {
  id: string;
  key: string;
  name: string;
  type: string;
  description?: {
    plain?: {
      value: string;
    };
  };
  homepage?: {
    id: string;
    title: string;
  };
}

export interface ConfluenceContent {
  id: string;
  title: string;
  type: string;
  status: string;
  space: {
    key: string;
    name: string;
  };
}

export interface UseConfluenceDataReturn {
  spaces: ConfluenceSpace[];
  content: ConfluenceContent[];
  isLoading: boolean;
  error: string | null;
  fetchSpaces: () => Promise<void>;
  fetchSpaceContent: (spaceKey: string, limit?: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

// PUBLIC_INTERFACE
export function useConfluenceData(): UseConfluenceDataReturn {
  /**
   * Hook for managing Confluence data fetching and state management.
   * Handles spaces and content retrieval.
   */
  const [spaces, setSpaces] = useState<ConfluenceSpace[]>([]);
  const [content, setContent] = useState<ConfluenceContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpaces = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://vscode-internal-17271-beta.beta01.cloud.kavia.ai:3001/confluence/spaces', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Confluence spaces');
      }

      const data = await response.json();
      setSpaces(data.spaces || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch spaces';
      setError(errorMessage);
      console.error('Failed to fetch Confluence spaces:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSpaceContent = useCallback(async (spaceKey: string, limit: number = 25) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://vscode-internal-17271-beta.beta01.cloud.kavia.ai:3001/confluence/spaces/${spaceKey}/content?limit=${limit}`,
        {
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch content for space ${spaceKey}`);
      }

      const data = await response.json();
      setContent(data.content || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch content';
      setError(errorMessage);
      console.error('Failed to fetch space content:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await fetchSpaces();
  }, [fetchSpaces]);

  return {
    spaces,
    content,
    isLoading,
    error,
    fetchSpaces,
    fetchSpaceContent,
    refreshData,
  };
}
