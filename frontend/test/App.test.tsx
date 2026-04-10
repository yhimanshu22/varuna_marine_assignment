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
  it("renders the main dashboard heading", async () => {
    render(<App />);
    expect(screen.getByText(/Varuna Marine Services/i)).toBeDefined();
    expect(screen.getByText(/Compliance Dashboard/i)).toBeDefined();
  });

  it("renders tab navigation buttons", async () => {
    render(<App />);
    expect(screen.getByText("Routes")).toBeDefined();
    expect(screen.getByText("Analytics")).toBeDefined();
    expect(screen.getByText("Banking")).toBeDefined();
    expect(screen.getByText("Pooling")).toBeDefined();
  });

  it("defaults to the Routes tab", async () => {
    // We use findByText to wait for the async data fetch in useEffect
    render(<App />);
    const routesBtn = await screen.findByText("Routes");
    expect(routesBtn).toBeDefined();
    
    // In our new UI, the active tab has 'text-teal-700' and 'bg-white'
    const activeBtn = document.querySelector('.text-teal-700.bg-white');
    expect(activeBtn?.textContent).toContain("Routes");
  });
});
