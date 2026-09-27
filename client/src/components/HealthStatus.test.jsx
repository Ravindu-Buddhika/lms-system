import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import HealthStatus from './HealthStatus';

describe('HealthStatus Component', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('renders loading state initially', () => {
    // Hang fetch so it stays in loading
    global.fetch = vi.fn(() => new Promise(() => {}));

    render(<HealthStatus endpoint="/api/health" />);

    expect(screen.getByTestId('health-loading')).toBeInTheDocument();
    expect(screen.getByText(/connecting to backend api/i)).toBeInTheDocument();
  });

  it('displays connected state with service details on successful backend response', async () => {
    const mockData = {
      status: 'ok',
      service: 'lms-api',
      timestamp: '2026-09-27T15:00:00.000Z',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData,
    });

    render(<HealthStatus endpoint="/api/health" />);

    await waitFor(() => {
      expect(screen.getByTestId('health-connected')).toBeInTheDocument();
    });

    expect(screen.getByText('Online')).toBeInTheDocument();
    expect(screen.getByText(/lms-api/)).toBeInTheDocument();
    expect(screen.getByText(/2026-09-27T15:00:00.000Z/)).toBeInTheDocument();
  });

  it('displays error state when backend fetch fails (network error)', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network connection failed'));

    render(<HealthStatus endpoint="/api/health" />);

    await waitFor(() => {
      expect(screen.getByTestId('health-error')).toBeInTheDocument();
    });

    expect(screen.getByText('Offline')).toBeInTheDocument();
    expect(screen.getByText(/network connection failed/i)).toBeInTheDocument();
    expect(screen.getByText(/ensure the backend server is running on port 5000/i)).toBeInTheDocument();
  });

  it('displays error state when server returns a non-OK HTTP status code', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({}),
    });

    render(<HealthStatus endpoint="/api/health" />);

    await waitFor(() => {
      expect(screen.getByTestId('health-error')).toBeInTheDocument();
    });

    expect(screen.getByText(/server returned http 503/i)).toBeInTheDocument();
  });

  it('re-fetches health status when refresh button is clicked', async () => {
    let callCount = 0;
    global.fetch = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.reject(new Error('Initial failure'));
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ status: 'ok', service: 'lms-api' }),
      });
    });

    render(<HealthStatus endpoint="/api/health" />);

    // First: should show error
    await waitFor(() => {
      expect(screen.getByTestId('health-error')).toBeInTheDocument();
    });

    // Click refresh
    const refreshBtn = screen.getByTestId('health-refresh-btn');
    fireEvent.click(refreshBtn);

    // Second: should recover to connected
    await waitFor(() => {
      expect(screen.getByTestId('health-connected')).toBeInTheDocument();
    });
    expect(screen.getByText('Online')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
