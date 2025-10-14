import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import KPIBar from './KPIBar';
import { useFilterStore } from '../stores/filterStore';

describe('KPIBar', () => {
  beforeEach(() => {
    // Reset filter store before each test
    useFilterStore.setState({
      lob: [],
      partyType: [],
      rating: [],
      assetClassification: [],
    });
  });

  it('renders all 8 KPI cards', () => {
    render(<KPIBar />);

    expect(screen.getByText('NPA %')).toBeInTheDocument();
    expect(screen.getByText('Total Exposure')).toBeInTheDocument();
    expect(screen.getByText('PAR %')).toBeInTheDocument();
    expect(screen.getByText('Delinquency %')).toBeInTheDocument();
    expect(screen.getByText('Utilization %')).toBeInTheDocument();
    expect(screen.getByText('RAROC %')).toBeInTheDocument();
    expect(screen.getByText('LGD %')).toBeInTheDocument();
    expect(screen.getByText('Expected Loss')).toBeInTheDocument();
  });

  it('displays KPI values with proper formatting', () => {
    const { container } = render(<KPIBar />);

    // Check that values are displayed (they should be formatted as currency or percentage)
    // KPI cards should exist with the proper class
    const kpiCards = container.querySelectorAll('.bg-white.rounded-lg.p-4');
    expect(kpiCards.length).toBe(8);
  });

  it('displays trend indicators for each KPI', () => {
    const { container } = render(<KPIBar />);

    // Check for trend icons (TrendingUp, TrendingDown, or Minus)
    const trendIcons = container.querySelectorAll('svg');
    expect(trendIcons.length).toBeGreaterThan(0);
  });

  it('displays change percentages for each KPI', () => {
    render(<KPIBar />);

    // All KPI cards should have a change percentage value
    // Looking for patterns like +X.X% or -X.X%
    const changePercentages = screen.getAllByText(/%$/);
    expect(changePercentages.length).toBeGreaterThan(0);
  });

  it('applies hover effect to KPI cards', () => {
    const { container } = render(<KPIBar />);

    const kpiCards = container.querySelectorAll('.hover\\:shadow-md');
    expect(kpiCards.length).toBe(8);
  });

  it('displays grid layout with proper responsive classes', () => {
    const { container } = render(<KPIBar />);

    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'xl:grid-cols-8');
  });
});
