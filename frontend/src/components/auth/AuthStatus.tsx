'use client';

interface AuthStatusProps {
  service: 'jira' | 'confluence';
  isConnected: boolean;
  userInfo?: {
    email?: string;
    displayName?: string;
    domain?: string;
  };
  onDisconnect: () => void;
}

// PUBLIC_INTERFACE
export default function AuthStatus({ service, isConnected, userInfo, onDisconnect }: AuthStatusProps) {
  /**
   * Authentication status indicator component that shows connection status,
   * user information, and provides disconnect functionality.
   */
  const serviceName = service === 'jira' ? 'Jira' : 'Confluence';

  if (!isConnected) {
    return (
      <div className="auth-status-disconnected p-4 bg-gray-50 border border-gray-200 rounded-md">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              Not connected to {serviceName}
            </p>
            <p className="text-sm text-gray-500">
              Choose an authentication method below to connect
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-status-connected p-4 bg-green-50 border border-green-200 rounded-md">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-900">
              Connected to {serviceName}
            </p>
            <div className="text-sm text-green-700 mt-1">
              {userInfo?.displayName && (
                <p>User: {userInfo.displayName}</p>
              )}
              {userInfo?.email && (
                <p>Email: {userInfo.email}</p>
              )}
              {userInfo?.domain && (
                <p>Domain: {userInfo.domain}</p>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={onDisconnect}
          className="button button-secondary text-sm"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}
