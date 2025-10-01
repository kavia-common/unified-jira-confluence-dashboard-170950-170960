'use client';

import { useState, useEffect } from 'react';
import JiraPanel from './JiraPanel';
import ConfluencePanel from './ConfluencePanel';
import WelcomePanel from './WelcomePanel';

type ConnectorType = 'jira' | 'confluence' | null;

// PUBLIC_INTERFACE
export default function MainContent() {
  const [activeConnector, setActiveConnector] = useState<ConnectorType>(null);

  useEffect(() => {
    const handleConnectorSelected = (event: CustomEvent) => {
      setActiveConnector(event.detail.connector);
    };

    window.addEventListener('connectorSelected', handleConnectorSelected as EventListener);

    return () => {
      window.removeEventListener('connectorSelected', handleConnectorSelected as EventListener);
    };
  }, []);

  const renderContent = () => {
    switch (activeConnector) {
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
