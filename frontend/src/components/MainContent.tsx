'use client';

import JiraPanel from './JiraPanel';
import ConfluencePanel from './ConfluencePanel';
import WelcomePanel from './WelcomePanel';
import { useApp } from '../contexts/AppContext';

// PUBLIC_INTERFACE
export default function MainContent() {
  /**
   * Main content component that displays the appropriate panel based on selected service.
   * Uses the app context to determine which service panel to show.
   */
  const app = useApp();

  const renderContent = () => {
    switch (app.state.ui.selectedService) {
      case 'jira':
        return <JiraPanel />;
      case 'confluence':
        return <ConfluencePanel />;
      default:
        return <WelcomePanel />;
    }
  };

  return <div className="main-content-wrapper">{renderContent()}</div>;
}
