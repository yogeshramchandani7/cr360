import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KPIDrilldownModal from './KPIDrilldownModal';
import type { AdvancedKPI } from '../types';

// Mock the kpiDrilldownData module
vi.mock('../lib/kpiDrilldownData', () => ({
  getChartsForKPI: vi.fn((kpiId: string) => {
    if (kpiId === 'quick_mortality') {
      return [
        {
          id: 'mortality_by_channel',
          title: 'Mortality by Channel',
          type: 'bar' as const,
          data: [
            { label: 'Branch', value: 3.2 },
            { label: 'Digital', value: 5.8 },
          ],
          filterField: 'channel',
        },
        {
          id: 'mortality_trend',
          title: 'Mortality Trend',
          type: 'line' as const,
          data: [
            { label: 'Jan', value: 4.1 },
            { label: 'Feb', value: 4.3 },
          ],
          filterField: 'month',
        },
      ];
    }
    if (kpiId === 'no_charts_kpi') {
      return [];
    }
    return [];
  }),
}));

// Mock ClickableChartCard component
vi.mock('./ClickableChartCard', () => ({
  default: ({ chart, kpiId }: any) => (
    <div data-testid={`chart-${chart.id}`}>
      <h3>{chart.title}</h3>
      <div data-testid="chart-type">{chart.type}</div>
      <div data-testid="kpi-id">{kpiId}</div>
    </div>
  ),
}));

describe('KPIDrilldownModal', () => {
  const mockKPI: AdvancedKPI = {
    id: 'quick_mortality',
    label: 'Quick Mortality Ratio',
    value: 4.43,
    unit: 'percent',
    trend: 'down',
    changePercent: -0.4,
    tooltip: {
      definition: 'Test definition',
      formula: 'Test formula',
      businessImplication: 'Test implication',
    },
    alertSeverity: 'warning',
  };

  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset body overflow before each test
    document.body.style.overflow = 'unset';
  });

  afterEach(() => {
    // Clean up body overflow after each test
    document.body.style.overflow = 'unset';
  });

  describe('Modal Visibility', () => {
    it('does not render when isOpen is false', () => {
      render(<KPIDrilldownModal kpi={mockKPI} isOpen={false} onClose={mockOnClose} />);
      expect(screen.queryByText('Quick Mortality Ratio')).not.toBeInTheDocument();
    });

    it('does not render when kpi is null', () => {
      render(<KPIDrilldownModal kpi={null} isOpen={true} onClose={mockOnClose} />);
      expect(screen.queryByText('Quick Mortality Ratio')).not.toBeInTheDocument();
    });

    it('renders when isOpen is true and kpi is provided', () => {
      render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);
      expect(screen.getByText('Quick Mortality Ratio')).toBeInTheDocument();
    });
  });

  describe('Modal Structure', () => {
    it('renders modal with backdrop', () => {
      const { container } = render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      const backdrop = container.querySelector('.bg-black.bg-opacity-50');
      expect(backdrop).toBeInTheDocument();
    });

    it('renders modal header with KPI label', () => {
      render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      const header = screen.getByText('Quick Mortality Ratio');
      expect(header).toBeInTheDocument();
      expect(header.tagName).toBe('H2');
    });

    it('displays current value', () => {
      render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('Current Value:')).toBeInTheDocument();
      expect(screen.getByText('4.43%')).toBeInTheDocument();
    });

    it('displays change percentage', () => {
      render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('Change:')).toBeInTheDocument();
      expect(screen.getByText('-0.40%')).toBeInTheDocument();
    });

    it('displays alert severity badge when present', () => {
      render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText(/warning/i)).toBeInTheDocument();
    });

    it('does not display alert badge when severity is none', () => {
      const kpiNoAlert: AdvancedKPI = { ...mockKPI, alertSeverity: 'none' };
      render(<KPIDrilldownModal kpi={kpiNoAlert} isOpen={true} onClose={mockOnClose} />);

      expect(screen.queryByText(/warning/i)).not.toBeInTheDocument();
    });

    it('renders close button', () => {
      render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /close modal/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('renders footer with instruction text', () => {
      render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText(/Click on any chart element to view filtered companies/i)).toBeInTheDocument();
    });
  });

  describe('Value Formatting', () => {
    it('formats percentage values correctly', () => {
      render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);
      expect(screen.getByText('4.43%')).toBeInTheDocument();
    });

    it('formats currency values in millions', () => {
      const currencyKPI: AdvancedKPI = {
        ...mockKPI,
        id: 'ecl_sensitivity',
        label: 'ECL Sensitivity',
        value: 580200000,
      };
      render(<KPIDrilldownModal kpi={currencyKPI} isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('$580.2M')).toBeInTheDocument();
    });

    it('formats basis points correctly', () => {
      const bpsKPI: AdvancedKPI = {
        ...mockKPI,
        id: 'net_pd_migration',
        label: 'Net PD Migration',
        value: 125.5,
      };
      render(<KPIDrilldownModal kpi={bpsKPI} isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('126 bps')).toBeInTheDocument();
    });

    it('formats index values as decimals', () => {
      const indexKPI: AdvancedKPI = {
        ...mockKPI,
        id: 'pbi',
        label: 'Pre-Delinquency Behavior Index',
        value: 42.5,
      };
      render(<KPIDrilldownModal kpi={indexKPI} isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('42.5')).toBeInTheDocument();
    });
  });

  describe('Change Indicator Styling', () => {
    it('applies red color for negative change', () => {
      render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      const changeValue = screen.getByText('-0.40%');
      expect(changeValue).toHaveClass('text-red-600');
    });

    it('applies green color for positive change', () => {
      const positiveKPI: AdvancedKPI = { ...mockKPI, changePercent: 2.5 };
      render(<KPIDrilldownModal kpi={positiveKPI} isOpen={true} onClose={mockOnClose} />);

      const changeValue = screen.getByText('+2.50%');
      expect(changeValue).toHaveClass('text-green-600');
    });

    it('includes + prefix for positive changes', () => {
      const positiveKPI: AdvancedKPI = { ...mockKPI, changePercent: 2.5 };
      render(<KPIDrilldownModal kpi={positiveKPI} isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('+2.50%')).toBeInTheDocument();
    });
  });

  describe('Alert Badge Styling', () => {
    it('uses red styling for critical alerts', () => {
      const criticalKPI: AdvancedKPI = { ...mockKPI, alertSeverity: 'critical' };
      const { container } = render(<KPIDrilldownModal kpi={criticalKPI} isOpen={true} onClose={mockOnClose} />);

      const badge = container.querySelector('.bg-red-100.text-red-700');
      expect(badge).toBeInTheDocument();
    });

    it('uses amber styling for warning alerts', () => {
      const { container } = render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      const badge = container.querySelector('.bg-amber-100.text-amber-700');
      expect(badge).toBeInTheDocument();
    });

    it('uses blue styling for info alerts', () => {
      const infoKPI: AdvancedKPI = { ...mockKPI, alertSeverity: 'info' };
      const { container } = render(<KPIDrilldownModal kpi={infoKPI} isOpen={true} onClose={mockOnClose} />);

      const badge = container.querySelector('.bg-blue-100.text-blue-700');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Chart Display', () => {
    it('renders charts when available', () => {
      render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByTestId('chart-mortality_by_channel')).toBeInTheDocument();
      expect(screen.getByTestId('chart-mortality_trend')).toBeInTheDocument();
    });

    it('displays chart titles', () => {
      render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('Mortality by Channel')).toBeInTheDocument();
      expect(screen.getByText('Mortality Trend')).toBeInTheDocument();
    });

    it('uses grid layout for charts', () => {
      const { container } = render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      const grid = container.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2');
      expect(grid).toBeInTheDocument();
    });

    it('displays empty state when no charts available', () => {
      const noChartsKPI: AdvancedKPI = {
        ...mockKPI,
        id: 'no_charts_kpi',
        label: 'KPI Without Charts',
      };

      render(<KPIDrilldownModal kpi={noChartsKPI} isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText(/No drilldown charts available for this KPI yet/i)).toBeInTheDocument();
      expect(screen.getByText(/Charts will be added soon/i)).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls onClose when backdrop is clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      const backdrop = container.querySelector('.bg-black.bg-opacity-50');
      if (backdrop) {
        await user.click(backdrop);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    });

    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /close modal/i });
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when Escape key is pressed', async () => {
      const user = userEvent.setup();
      render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      await user.keyboard('{Escape}');

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when other keys are pressed', async () => {
      const user = userEvent.setup();
      render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      await user.keyboard('{Enter}');
      await user.keyboard('{Space}');
      await user.keyboard('a');

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Body Scroll Management', () => {
    it('prevents body scroll when modal is open', () => {
      render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body scroll when modal is closed', () => {
      const { rerender } = render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      expect(document.body.style.overflow).toBe('hidden');

      rerender(<KPIDrilldownModal kpi={mockKPI} isOpen={false} onClose={mockOnClose} />);

      expect(document.body.style.overflow).toBe('unset');
    });

    it('cleans up body overflow on unmount', () => {
      const { unmount } = render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      unmount();

      expect(document.body.style.overflow).toBe('unset');
    });
  });

  describe('Keyboard Event Listeners', () => {
    it('adds keyboard event listener when opened', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      addEventListenerSpy.mockRestore();
    });

    it('removes keyboard event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { unmount } = render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('uses proper ARIA label for close button', () => {
      render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /close modal/i });
      expect(closeButton).toHaveAttribute('aria-label', 'Close modal');
    });

    it('uses aria-hidden for backdrop', () => {
      const { container } = render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      const backdrop = container.querySelector('.bg-black.bg-opacity-50');
      expect(backdrop).toHaveAttribute('aria-hidden', 'true');
    });

    it('uses semantic HTML for header', () => {
      render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      const header = screen.getByText('Quick Mortality Ratio');
      expect(header.tagName).toBe('H2');
    });
  });

  describe('Responsive Design', () => {
    it('uses responsive grid columns', () => {
      const { container } = render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      const grid = container.querySelector('.grid-cols-1.lg\\:grid-cols-2');
      expect(grid).toBeInTheDocument();
    });

    it('uses responsive modal width', () => {
      const { container } = render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      const modal = container.querySelector('.max-w-6xl');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles zero change percentage', () => {
      const zeroChangeKPI: AdvancedKPI = { ...mockKPI, changePercent: 0 };
      render(<KPIDrilldownModal kpi={zeroChangeKPI} isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('0.00%')).toBeInTheDocument();
    });

    it('handles very large values', () => {
      const largeValueKPI: AdvancedKPI = {
        ...mockKPI,
        id: 'ecl_sensitivity',
        value: 999999999999,
      };
      render(<KPIDrilldownModal kpi={largeValueKPI} isOpen={true} onClose={mockOnClose} />);

      // Should format to millions
      expect(screen.getByText('$1000000.0M')).toBeInTheDocument();
    });

    it('handles KPI with no alert severity', () => {
      const noAlertKPI: AdvancedKPI = {
        ...mockKPI,
        alertSeverity: undefined,
      };
      render(<KPIDrilldownModal kpi={noAlertKPI} isOpen={true} onClose={mockOnClose} />);

      // Should not throw and should render without badge
      expect(screen.getByText('Quick Mortality Ratio')).toBeInTheDocument();
    });

    it('handles reopening modal after closing', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);

      // Close modal
      const closeButton = screen.getByRole('button', { name: /close modal/i });
      await user.click(closeButton);

      rerender(<KPIDrilldownModal kpi={mockKPI} isOpen={false} onClose={mockOnClose} />);
      expect(screen.queryByText('Quick Mortality Ratio')).not.toBeInTheDocument();

      // Reopen modal
      rerender(<KPIDrilldownModal kpi={mockKPI} isOpen={true} onClose={mockOnClose} />);
      expect(screen.getByText('Quick Mortality Ratio')).toBeInTheDocument();
    });
  });
});
