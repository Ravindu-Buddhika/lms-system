import React, { useState, useEffect } from 'react';
import Badge from './Badge';

/**
 * HealthStatus component displaying live backend connection status.
 */
export const HealthStatus = ({ endpoint = '/api/health' }) => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'connected' | 'error'
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    setStatus('loading');
    setError(null);

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }
      const json = await response.json();
      setData(json);
      setStatus('connected');
    } catch (err) {
      setError(err.message || 'Unable to connect to backend service');
      setStatus('error');
    }
  };

  useEffect(() => {
    checkHealth();
  }, [endpoint]);

  return (
    <section className="health-status-container" data-testid="health-container">
      <div className="health-status-header">
        <h2>Backend Status</h2>
        <button 
          onClick={checkHealth} 
          className="btn-refresh"
          data-testid="health-refresh-btn"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Checking...' : 'Refresh'}
        </button>
      </div>

      {status === 'loading' && (
        <div className="status-box loading" data-testid="health-loading">
          <span className="spinner" aria-hidden="true"></span>
          <span>Connecting to backend API...</span>
        </div>
      )}

      {status === 'connected' && (
        <div className="status-box connected" data-testid="health-connected">
          <div className="status-pill">
            <Badge variant="success">Online</Badge>
          </div>
          <div className="status-details">
            <p><strong>Service:</strong> {data?.service || 'lms-api'}</p>
            <p><strong>Status:</strong> {data?.status || 'ok'}</p>
            {data?.timestamp && <p><strong>Timestamp:</strong> {data.timestamp}</p>}
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="status-box error" data-testid="health-error">
          <div className="status-pill">
            <Badge variant="danger">Offline</Badge>
          </div>
          <div className="status-details">
            <p className="error-message">{error}</p>
            <p className="error-hint">Ensure the backend server is running on port 5000.</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default HealthStatus;
