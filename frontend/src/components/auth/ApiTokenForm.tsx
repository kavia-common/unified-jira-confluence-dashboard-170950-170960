'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { APITokenRequest } from '../../services/api';

interface ApiTokenFormData {
  domain: string;
  email: string;
  apiToken: string;
}

interface ApiTokenFormProps {
  service: 'jira' | 'confluence';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// PUBLIC_INTERFACE
export default function ApiTokenForm({ service, onSuccess, onError }: ApiTokenFormProps) {
  /**
   * API token authentication form component for Jira and Confluence services.
   * Handles form validation, submission, and error states using the new auth context.
   */
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ApiTokenFormData>({
    domain: '',
    email: '',
    apiToken: ''
  });
  const [validationErrors, setValidationErrors] = useState<Partial<ApiTokenFormData>>({});
  const auth = useAuth();

  const validateForm = (): boolean => {
    const errors: Partial<ApiTokenFormData> = {};
    
    if (!formData.domain.trim()) {
      errors.domain = 'Domain is required';
    } else if (!formData.domain.includes('.atlassian.net')) {
      errors.domain = 'Please enter a valid Atlassian domain (e.g., company.atlassian.net)';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.apiToken.trim()) {
      errors.apiToken = 'API token is required';
    } else if (formData.apiToken.length < 10) {
      errors.apiToken = 'API token appears to be too short';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name as keyof ApiTokenFormData]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const credentials: APITokenRequest = {
        domain: formData.domain,
        email: formData.email,
        api_token: formData.apiToken,
      };

      if (service === 'jira') {
        await auth.loginJiraWithToken(credentials);
      } else {
        await auth.loginConfluenceWithToken(credentials);
      }

      // Success callback
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed. Please check your credentials.';
      onError?.(errorMessage);
      console.error('Token auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const serviceName = service === 'jira' ? 'Jira' : 'Confluence';

  return (
    <div className="api-token-form">
      <h3 className="text-lg font-medium mb-4">API Token Authentication</h3>
      
      <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-amber-800">
              API Token Security
            </h4>
            <p className="text-sm text-amber-700 mt-1">
              API tokens provide full access to your {serviceName} account. Keep them secure and never share them.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label htmlFor={`${service}-domain`} className="form-label">
            {serviceName} Domain *
          </label>
          <input
            type="text"
            id={`${service}-domain`}
            name="domain"
            value={formData.domain}
            onChange={handleInputChange}
            placeholder="your-company.atlassian.net"
            className={`form-input ${validationErrors.domain ? 'border-red-500' : ''}`}
            required
          />
          {validationErrors.domain && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.domain}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Enter your Atlassian domain without https://
          </p>
        </div>

        <div className="form-group">
          <label htmlFor={`${service}-email`} className="form-label">
            Email Address *
          </label>
          <input
            type="email"
            id={`${service}-email`}
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your-email@company.com"
            className={`form-input ${validationErrors.email ? 'border-red-500' : ''}`}
            required
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor={`${service}-token`} className="form-label">
            API Token *
          </label>
          <input
            type="password"
            id={`${service}-token`}
            name="apiToken"
            value={formData.apiToken}
            onChange={handleInputChange}
            placeholder={`Your ${serviceName} API token`}
            className={`form-input ${validationErrors.apiToken ? 'border-red-500' : ''}`}
            required
          />
          {validationErrors.apiToken && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.apiToken}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Get your API token from{' '}
            <a
              href="https://id.atlassian.com/manage-profile/security/api-tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Atlassian Account Settings
            </a>
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="button button-primary w-full flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Authenticating...
            </>
          ) : (
            `Connect with API Token`
          )}
        </button>
      </form>
    </div>
  );
}
