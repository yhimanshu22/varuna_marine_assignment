import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../src/App';

// Mock the Axios API client to avoid live calls
vi.mock('../src/adapters/infrastructure/AxiosApiClient', () => ({
  apiClient: {
    getRoutes: vi.fn().mockResolvedValue([]),
    getComparison: vi.fn().mockResolvedValue([]),
    getAdjustedCB: vi.fn().mockResolvedValue({ shipId: "RTEST", year: 2025, adjustedCb: 100 }),
    createPool: vi.fn(),
    bankSurplus: vi.fn(),
    applySurplus: vi.fn()
  }
}));

describe("App Layout", () => {
  it("renders the main dashboard heading", () => {
    render(<App />);
    expect(screen.getByText(/FuelEU Maritime Dashboard/i)).toBeDefined();
  });

  it("renders tab navigation buttons", () => {
    render(<App />);
    expect(screen.getByText("Routes")).toBeDefined();
    expect(screen.getByText("Compare")).toBeDefined();
    expect(screen.getByText("Banking")).toBeDefined();
    expect(screen.getByText("Pooling")).toBeDefined();
  });

  it("defaults to the Routes tab", () => {
    const { container } = render(<App />);
    expect(container.querySelector('.bg-blue-100')?.textContent).toContain("Routes");
  });
});
