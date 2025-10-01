# Data Display Components

This document describes the enhanced data display components implemented for the Unified Jira & Confluence Dashboard.

## Overview

The data display components provide a modern, professional interface for viewing Jira projects and Confluence spaces with Ocean Professional theme styling.

## Components

### JiraProjectDisplay (`src/components/data/JiraProjectDisplay.tsx`)

**Purpose:** Displays Jira projects with enhanced UI and interactive features.

**Features:**
- Expandable project cards with detailed information
- Loading states with progress indicators
- Error handling with retry functionality
- Empty states with helpful messaging
- Refresh functionality
- Ocean Professional theme styling
- Mobile responsive design

**Props:**
- `projects: JiraProject[]` - Array of Jira projects to display
- `isLoading: boolean` - Loading state indicator
- `error: string | null` - Error message if any
- `onRefresh?: () => void` - Optional refresh callback

### ConfluenceSpaceDisplay (`src/components/data/ConfluenceSpaceDisplay.tsx`)

**Purpose:** Displays Confluence spaces with navigation to space content.

**Features:**
- Expandable space cards with detailed information
- Space selection for content viewing
- Loading states and error handling
- Empty states with helpful messaging
- Refresh functionality
- Ocean Professional theme styling
- Mobile responsive design

**Props:**
- `spaces: ConfluenceSpace[]` - Array of Confluence spaces to display
- `isLoading: boolean` - Loading state indicator
- `error: string | null` - Error message if any
- `onRefresh?: () => void` - Optional refresh callback
- `onSpaceSelect?: (spaceKey: string) => void` - Space selection callback

### ConfluenceContentDisplay (`src/components/data/ConfluenceContentDisplay.tsx`)

**Purpose:** Displays content from a selected Confluence space.

**Features:**
- Content type icons (pages, blog posts, etc.)
- Status indicators (current, draft, archived)
- Content metadata display
- Back navigation to spaces view
- Loading states and error handling
- Ocean Professional theme styling
- Mobile responsive design

**Props:**
- `content: ConfluenceContent[]` - Array of content items to display
- `isLoading: boolean` - Loading state indicator
- `error: string | null` - Error message if any
- `spaceKey?: string` - Current space key for context
- `onBack?: () => void` - Back navigation callback

## Theme Integration

All components implement the Ocean Professional theme with:

- **Primary Color:** #1E3A8A (Deep Blue)
- **Secondary Color:** #F59E0B (Amber)
- **Success Color:** #059669 (Green)
- **Error Color:** #DC2626 (Red)
- **Background:** #F3F4F6 (Light Gray)
- **Surface:** #FFFFFF (White)
- **Text:** #111827 (Dark Gray)

## CSS Classes

Key CSS classes used by the data components:

- `.data-display-container` - Main container wrapper
- `.data-header` - Header section with title and controls
- `.data-grid` - Grid layout for cards
- `.data-card` - Individual project/space cards
- `.data-card-expanded` - Expanded card state
- `.error-state` - Error display state
- `.empty-state` - Empty content state
- `.loading-shimmer` - Loading animation effect

## Usage Example

```tsx
import { JiraProjectDisplay, ConfluenceSpaceDisplay } from './components/data';
import { useJiraData, useConfluenceData } from './hooks';

function MyComponent() {
  const { projects, isLoading, error, fetchProjects } = useJiraData();
  const { spaces, fetchSpaces, fetchSpaceContent } = useConfluenceData();

  return (
    <div>
      <JiraProjectDisplay
        projects={projects}
        isLoading={isLoading}
        error={error}
        onRefresh={fetchProjects}
      />
      
      <ConfluenceSpaceDisplay
        spaces={spaces}
        isLoading={isLoading}
        error={error}
        onRefresh={fetchSpaces}
        onSpaceSelect={(spaceKey) => fetchSpaceContent(spaceKey)}
      />
    </div>
  );
}
```

## Integration

The data components are integrated into the main panel components:

- **JiraPanel** uses `JiraProjectDisplay` for enhanced project viewing
- **ConfluencePanel** uses both `ConfluenceSpaceDisplay` and `ConfluenceContentDisplay` with dynamic switching
- **MainContent** handles the overall layout and switching between services

## Accessibility

All components include:

- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader friendly content
- High contrast support

## Mobile Responsiveness

Components adapt to mobile devices with:

- Responsive grid layouts
- Touch-friendly buttons
- Optimized spacing
- Collapsible navigation
- Readable typography at all sizes
