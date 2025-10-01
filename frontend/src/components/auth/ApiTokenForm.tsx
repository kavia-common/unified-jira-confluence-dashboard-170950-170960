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
   * Handles form validation, submission, and error states using the auth context.
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
            className={`form-input ${validationErrors.domain ? 'error' : ''}`}
            required
            aria-invalid={!!validationErrors.domain}
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
            className={`form-input ${validationErrors.email ? 'error' : ''}`}
            required
            aria-invalid={!!validationErrors.email}
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
            className={`form-input ${validationErrors.apiToken ? 'error' : ''}`}
            required
            aria-invalid={!!validationErrors.apiToken}
          />
          {validationErrors.apiToken && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.apiToken}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="button button-secondary w-full flex items-center justify-center"
          aria-busy={isLoading}
        >
          {isLoading ? 'Authenticating...' : `Connect with API Token`}
        </button>
      </form>
    </div>
  );
}
