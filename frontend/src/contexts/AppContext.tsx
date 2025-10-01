'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { JiraProject, ConfluenceSpace, ConfluenceContent } from '../services/api';

// Data state types
export interface JiraData {
  projects: JiraProject[];
  selectedProject: JiraProject | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

export interface ConfluenceData {
  spaces: ConfluenceSpace[];
  selectedSpace: ConfluenceSpace | null;
  spaceContent: ConfluenceContent[];
  isLoading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

// UI state types
export interface UIState {
  selectedService: 'jira' | 'confluence' | null;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
}

// Global application state
export interface AppState {
  jira: JiraData;
  confluence: ConfluenceData;
  ui: UIState;
}

// Action types
type AppAction =
  // Jira actions
  | { type: 'JIRA_LOAD_START' }
  | { type: 'JIRA_LOAD_SUCCESS'; payload: { projects: JiraProject[] } }
  | { type: 'JIRA_LOAD_ERROR'; payload: { error: string } }
  | { type: 'JIRA_SELECT_PROJECT'; payload: { project: JiraProject | null } }
  | { type: 'JIRA_CLEAR_ERROR' }
  | { type: 'JIRA_RESET' }
  
  // Confluence actions
  | { type: 'CONFLUENCE_LOAD_SPACES_START' }
  | { type: 'CONFLUENCE_LOAD_SPACES_SUCCESS'; payload: { spaces: ConfluenceSpace[] } }
  | { type: 'CONFLUENCE_LOAD_SPACES_ERROR'; payload: { error: string } }
  | { type: 'CONFLUENCE_SELECT_SPACE'; payload: { space: ConfluenceSpace | null } }
  | { type: 'CONFLUENCE_LOAD_CONTENT_START' }
  | { type: 'CONFLUENCE_LOAD_CONTENT_SUCCESS'; payload: { content: ConfluenceContent[] } }
  | { type: 'CONFLUENCE_LOAD_CONTENT_ERROR'; payload: { error: string } }
  | { type: 'CONFLUENCE_CLEAR_ERROR' }
  | { type: 'CONFLUENCE_RESET' }
  
  // UI actions
  | { type: 'UI_SELECT_SERVICE'; payload: { service: 'jira' | 'confluence' | null } }
  | { type: 'UI_TOGGLE_SIDEBAR' }
  | { type: 'UI_SET_SIDEBAR_COLLAPSED'; payload: { collapsed: boolean } }
  | { type: 'UI_SET_THEME'; payload: { theme: 'light' | 'dark' } }
  | { type: 'UI_ADD_NOTIFICATION'; payload: { notification: Omit<Notification, 'id' | 'timestamp'> } }
  | { type: 'UI_REMOVE_NOTIFICATION'; payload: { id: string } }
  | { type: 'UI_CLEAR_NOTIFICATIONS' };

// Initial state
const initialState: AppState = {
  jira: {
    projects: [],
    selectedProject: null,
    isLoading: false,
    error: null,
    lastFetched: null,
  },
  confluence: {
    spaces: [],
    selectedSpace: null,
    spaceContent: [],
    isLoading: false,
    error: null,
    lastFetched: null,
  },
  ui: {
    selectedService: null,
    sidebarCollapsed: false,
    theme: 'light',
    notifications: [],
  },
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // Jira reducers
    case 'JIRA_LOAD_START':
      return {
        ...state,
        jira: { ...state.jira, isLoading: true, error: null },
      };

    case 'JIRA_LOAD_SUCCESS':
      return {
        ...state,
        jira: {
          ...state.jira,
          projects: action.payload.projects,
          isLoading: false,
          error: null,
          lastFetched: new Date(),
        },
      };

    case 'JIRA_LOAD_ERROR':
      return {
        ...state,
        jira: {
          ...state.jira,
          isLoading: false,
          error: action.payload.error,
        },
      };

    case 'JIRA_SELECT_PROJECT':
      return {
        ...state,
        jira: { ...state.jira, selectedProject: action.payload.project },
      };

    case 'JIRA_CLEAR_ERROR':
      return {
        ...state,
        jira: { ...state.jira, error: null },
      };

    case 'JIRA_RESET':
      return {
        ...state,
        jira: initialState.jira,
      };

    // Confluence reducers
    case 'CONFLUENCE_LOAD_SPACES_START':
      return {
        ...state,
        confluence: { ...state.confluence, isLoading: true, error: null },
      };

    case 'CONFLUENCE_LOAD_SPACES_SUCCESS':
      return {
        ...state,
        confluence: {
          ...state.confluence,
          spaces: action.payload.spaces,
          isLoading: false,
          error: null,
          lastFetched: new Date(),
        },
      };

    case 'CONFLUENCE_LOAD_SPACES_ERROR':
      return {
        ...state,
        confluence: {
          ...state.confluence,
          isLoading: false,
          error: action.payload.error,
        },
      };

    case 'CONFLUENCE_SELECT_SPACE':
      return {
        ...state,
        confluence: {
          ...state.confluence,
          selectedSpace: action.payload.space,
          spaceContent: [], // Clear content when switching spaces
        },
      };

    case 'CONFLUENCE_LOAD_CONTENT_START':
      return {
        ...state,
        confluence: { ...state.confluence, isLoading: true, error: null },
      };

    case 'CONFLUENCE_LOAD_CONTENT_SUCCESS':
      return {
        ...state,
        confluence: {
          ...state.confluence,
          spaceContent: action.payload.content,
          isLoading: false,
          error: null,
        },
      };

    case 'CONFLUENCE_LOAD_CONTENT_ERROR':
      return {
        ...state,
        confluence: {
          ...state.confluence,
          isLoading: false,
          error: action.payload.error,
        },
      };

    case 'CONFLUENCE_CLEAR_ERROR':
      return {
        ...state,
        confluence: { ...state.confluence, error: null },
      };

    case 'CONFLUENCE_RESET':
      return {
        ...state,
        confluence: initialState.confluence,
      };

    // UI reducers
    case 'UI_SELECT_SERVICE':
      return {
        ...state,
        ui: { ...state.ui, selectedService: action.payload.service },
      };

    case 'UI_TOGGLE_SIDEBAR':
      return {
        ...state,
        ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed },
      };

    case 'UI_SET_SIDEBAR_COLLAPSED':
      return {
        ...state,
        ui: { ...state.ui, sidebarCollapsed: action.payload.collapsed },
      };

    case 'UI_SET_THEME':
      return {
        ...state,
        ui: { ...state.ui, theme: action.payload.theme },
      };

    case 'UI_ADD_NOTIFICATION':
      const newNotification: Notification = {
        ...action.payload.notification,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
      };
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: [...state.ui.notifications, newNotification],
        },
      };

    case 'UI_REMOVE_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(
            notification => notification.id !== action.payload.id
          ),
        },
      };

    case 'UI_CLEAR_NOTIFICATIONS':
      return {
        ...state,
        ui: { ...state.ui, notifications: [] },
      };

    default:
      return state;
  }
}

// Context value interface
export interface AppContextValue {
  state: AppState;
  
  // Jira actions
  loadJiraProjects: () => Promise<void>;
  selectJiraProject: (project: JiraProject | null) => void;
  clearJiraError: () => void;
  resetJiraData: () => void;
  
  // Confluence actions
  loadConfluenceSpaces: () => Promise<void>;
  selectConfluenceSpace: (space: ConfluenceSpace | null) => void;
  loadConfluenceSpaceContent: (spaceKey: string, limit?: number) => Promise<void>;
  clearConfluenceError: () => void;
  resetConfluenceData: () => void;
  
  // UI actions
  selectService: (service: 'jira' | 'confluence' | null) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// Create context
const AppContext = createContext<AppContextValue | undefined>(undefined);

// PUBLIC_INTERFACE
export function AppProvider({ children }: { children: ReactNode }) {
  /**
   * Application context provider that manages global application state.
   * Provides data management for Jira and Confluence, as well as UI state management.
   */
  
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Import API functions locally to avoid circular dependencies
  const loadJiraProjects = async (): Promise<void> => {
    dispatch({ type: 'JIRA_LOAD_START' });
    
    try {
      const { api } = await import('../services/api');
      const projects = await api.getJiraProjects();
      
      dispatch({
        type: 'JIRA_LOAD_SUCCESS',
        payload: { projects },
      });
      
      // Add success notification
      dispatch({
        type: 'UI_ADD_NOTIFICATION',
        payload: {
          notification: {
            type: 'success',
            title: 'Jira Projects Loaded',
            message: `Successfully loaded ${projects.length} project(s)`,
            duration: 3000,
          },
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load Jira projects';
      
      dispatch({
        type: 'JIRA_LOAD_ERROR',
        payload: { error: errorMessage },
      });
      
      // Add error notification
      dispatch({
        type: 'UI_ADD_NOTIFICATION',
        payload: {
          notification: {
            type: 'error',
            title: 'Failed to Load Jira Projects',
            message: errorMessage,
            duration: 5000,
          },
        },
      });
      
      throw error;
    }
  };

  const selectJiraProject = (project: JiraProject | null): void => {
    dispatch({ type: 'JIRA_SELECT_PROJECT', payload: { project } });
  };

  const clearJiraError = (): void => {
    dispatch({ type: 'JIRA_CLEAR_ERROR' });
  };

  const resetJiraData = (): void => {
    dispatch({ type: 'JIRA_RESET' });
  };

  const loadConfluenceSpaces = async (): Promise<void> => {
    dispatch({ type: 'CONFLUENCE_LOAD_SPACES_START' });
    
    try {
      const { api } = await import('../services/api');
      const spaces = await api.getConfluenceSpaces();
      
      dispatch({
        type: 'CONFLUENCE_LOAD_SPACES_SUCCESS',
        payload: { spaces },
      });
      
      // Add success notification
      dispatch({
        type: 'UI_ADD_NOTIFICATION',
        payload: {
          notification: {
            type: 'success',
            title: 'Confluence Spaces Loaded',
            message: `Successfully loaded ${spaces.length} space(s)`,
            duration: 3000,
          },
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load Confluence spaces';
      
      dispatch({
        type: 'CONFLUENCE_LOAD_SPACES_ERROR',
        payload: { error: errorMessage },
      });
      
      // Add error notification
      dispatch({
        type: 'UI_ADD_NOTIFICATION',
        payload: {
          notification: {
            type: 'error',
            title: 'Failed to Load Confluence Spaces',
            message: errorMessage,
            duration: 5000,
          },
        },
      });
      
      throw error;
    }
  };

  const selectConfluenceSpace = (space: ConfluenceSpace | null): void => {
    dispatch({ type: 'CONFLUENCE_SELECT_SPACE', payload: { space } });
  };

  const loadConfluenceSpaceContent = async (spaceKey: string, limit: number = 25): Promise<void> => {
    dispatch({ type: 'CONFLUENCE_LOAD_CONTENT_START' });
    
    try {
      const { api } = await import('../services/api');
      const content = await api.getConfluenceSpaceContent(spaceKey, limit);
      
      dispatch({
        type: 'CONFLUENCE_LOAD_CONTENT_SUCCESS',
        payload: { content },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load space content';
      
      dispatch({
        type: 'CONFLUENCE_LOAD_CONTENT_ERROR',
        payload: { error: errorMessage },
      });
      
      // Add error notification
      dispatch({
        type: 'UI_ADD_NOTIFICATION',
        payload: {
          notification: {
            type: 'error',
            title: 'Failed to Load Space Content',
            message: errorMessage,
            duration: 5000,
          },
        },
      });
      
      throw error;
    }
  };

  const clearConfluenceError = (): void => {
    dispatch({ type: 'CONFLUENCE_CLEAR_ERROR' });
  };

  const resetConfluenceData = (): void => {
    dispatch({ type: 'CONFLUENCE_RESET' });
  };

  const selectService = (service: 'jira' | 'confluence' | null): void => {
    dispatch({ type: 'UI_SELECT_SERVICE', payload: { service } });
  };

  const toggleSidebar = (): void => {
    dispatch({ type: 'UI_TOGGLE_SIDEBAR' });
  };

  const setSidebarCollapsed = (collapsed: boolean): void => {
    dispatch({ type: 'UI_SET_SIDEBAR_COLLAPSED', payload: { collapsed } });
  };

  const setTheme = (theme: 'light' | 'dark'): void => {
    dispatch({ type: 'UI_SET_THEME', payload: { theme } });
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>): void => {
    dispatch({ type: 'UI_ADD_NOTIFICATION', payload: { notification } });
  };

  const removeNotification = (id: string): void => {
    dispatch({ type: 'UI_REMOVE_NOTIFICATION', payload: { id } });
  };

  const clearNotifications = (): void => {
    dispatch({ type: 'UI_CLEAR_NOTIFICATIONS' });
  };

  const contextValue: AppContextValue = {
    state,
    
    // Jira actions
    loadJiraProjects,
    selectJiraProject,
    clearJiraError,
    resetJiraData,
    
    // Confluence actions
    loadConfluenceSpaces,
    selectConfluenceSpace,
    loadConfluenceSpaceContent,
    clearConfluenceError,
    resetConfluenceData,
    
    // UI actions
    selectService,
    toggleSidebar,
    setSidebarCollapsed,
    setTheme,
    addNotification,
    removeNotification,
    clearNotifications,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

// PUBLIC_INTERFACE
export function useApp(): AppContextValue {
  /**
   * Hook to access application context.
   * Must be used within an AppProvider.
   */
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
