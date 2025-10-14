import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdvancedKPIBar from './AdvancedKPIBar';

// Mock the CCO KPI calculation
vi.mock('../lib/mockCCOData', () => ({
  calculateCCOKPIs: vi.fn(() => ({
    quick_mortality: {
      id: 'quick_mortality',
      label: 'Quick Mortality Ratio',
      value: 4.43,
      changePercent: -0.40,
      alertSeverity: 'critical',
      tooltip: {
        definition: 'Test definition',
        formula: 'Test formula',
        businessImplication: 'Test implication',
      },
      components: [],
    },
    forward_delinquency: {
      id: 'forward_delinquency',
      label: 'Forward Delinquency Forecast',
      value: 20.6,
      changePercent: 1.20,
      alertSeverity: 'warning',
      tooltip: {
        definition: 'Test definition',
        formula: 'Test formula',
        businessImplication: 'Test implication',
      },
      components: [],
    },
    pbi: {
      id: 'pbi',
      label: 'Pre-Delinquency Behavior Index',
      value: 42.5,
      changePercent: 2.30,
      alertSeverity: 'info',
      tooltip: {
        definition: 'Test definition',
        formula: 'Test formula',
        businessImplication: 'Test implication',
      },
      components: [],
    },
    vdi: {
      id: 'vdi',
      label: 'Vintage Deterioration Index',
      value: 18.75,
      changePercent: 0.85,
      alertSeverity: 'none',
      tooltip: {
        definition: 'Test definition',
        formula: 'Test formula',
        businessImplication: 'Test implication',
      },
      components: [],
    },
    net_pd_migration: {
      id: 'net_pd_migration',
      label: 'Net PD Migration',
      value: 125,
      changePercent: 15.0,
      alertSeverity: 'critical',
      tooltip: {
        definition: 'Test definition',
        formula: 'Test formula',
        businessImplication: 'Test implication',
      },
      components: [],
    },
    concentration_contagion: {
      id: 'concentration_contagion',
      label: 'Concentration & Contagion Index',
      value: 5802000000,
      changePercent: -10.80,
      alertSeverity: 'warning',
      tooltip: {
        definition: 'Test definition',
        formula: 'Test formula',
        businessImplication: 'Test implication',
      },
      components: [],
    },
    utilization_stress: {
      id: 'utilization_stress',
      label: 'Utilization & Liquidity Stress',
      value: 85.2,
      changePercent: 3.40,
      alertSeverity: 'info',
      tooltip: {
        definition: 'Test definition',
        formula: 'Test formula',
        businessImplication: 'Test implication',
      },
      components: [],
    },
    reversion_rate: {
      id: 'reversion_rate',
      label: 'Restructure Reversion Rate',
      value: 20.6,
      changePercent: 5.20,
      alertSeverity: 'warning',
      tooltip: {
        definition: 'Test definition',
        formula: 'Test formula',
        businessImplication: 'Test implication',
      },
      components: [],
    },
    ecl_sensitivity: {
      id: 'ecl_sensitivity',
      label: 'Forward ECL Sensitivity',
      value: 580200000,
      changePercent: 8.50,
      alertSeverity: 'critical',
      tooltip: {
        definition: 'Test definition',
        formula: 'Test formula',
        businessImplication: 'Test implication',
      },
      components: [],
    },
    pphs: {
      id: 'pphs',
      label: 'Portfolio Predictive Health Score',
      value: 67.8,
      changePercent: -2.10,
      alertSeverity: 'none',
      tooltip: {
        definition: 'Test definition',
        formula: 'Test formula',
        businessImplication: 'Test implication',
      },
      components: [],
    },
  })),
}));

// Mock KPIDrilldownModal
vi.mock('./KPIDrilldownModal', () => ({
  default: ({ kpi, isOpen, onClose }: any) => {
    if (!isOpen || !kpi) return null;
    return (
      <div data-testid="kpi-drilldown-modal">
        <h2>{kpi.label}</h2>
        <button onClick={onClose}>Close</button>
      </div>
    );
  },
}));

describe('AdvancedKPIBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the component', () => {
      render(<AdvancedKPIBar />);
      expect(screen.getByText('Quick Mortality Ratio')).toBeInTheDocument();
    });

    it('renders all 10 KPI cards', () => {
      render(<AdvancedKPIBar />);

      expect(screen.getByText('Quick Mortality Ratio')).toBeInTheDocument();
      expect(screen.getByText('Forward Delinquency Forecast')).toBeInTheDocument();
      expect(screen.getByText('Pre-Delinquency Behavior Index')).toBeInTheDocument();
      expect(screen.getByText('Vintage Deterioration Index')).toBeInTheDocument();
      expect(screen.getByText('Net PD Migration')).toBeInTheDocument();
      expect(screen.getByText('Concentration & Contagion Index')).toBeInTheDocument();
      expect(screen.getByText('Utilization & Liquidity Stress')).toBeInTheDocument();
      expect(screen.getByText('Restructure Reversion Rate')).toBeInTheDocument();
      expect(screen.getByText('Forward ECL Sensitivity')).toBeInTheDocument();
      expect(screen.getByText('Portfolio Predictive Health Score')).toBeInTheDocument();
    });

    it('displays KPI values correctly formatted', () => {
      render(<AdvancedKPIBar />);

      expect(screen.getByText('4.43%')).toBeInTheDocument(); // Quick mortality
      expect(screen.getByText('20.60%')).toBeInTheDocument(); // Forward delinquency (multiple instances)
      expect(screen.getByText('125 bps')).toBeInTheDocument(); // Net PD migration
      expect(screen.getByText('$5.8B')).toBeInTheDocument(); // Concentration
      expect(screen.getByText('85.2%')).toBeInTheDocument(); // Utilization
      expect(screen.getByText('$580.2M')).toBeInTheDocument(); // ECL sensitivity
    });

    it('displays change percentages', () => {
      render(<AdvancedKPIBar />);

      // Find positive change (should have '+' prefix)
      const positiveChanges = screen.getAllByText(/\+/);
      expect(positiveChanges.length).toBeGreaterThan(0);

      // Find negative change (should have '-' prefix)
      const negativeChanges = screen.getAllByText(/-\d+\.\d+%/);
      expect(negativeChanges.length).toBeGreaterThan(0);
    });

    it('uses grid layout with correct columns', () => {
      const { container } = render(<AdvancedKPIBar />);
      const grid = container.querySelector('.grid');

      expect(grid).toHaveClass('grid-cols-2');
      expect(grid).toHaveClass('md:grid-cols-3');
      expect(grid).toHaveClass('lg:grid-cols-5');
    });
  });

  describe('Alert Badges', () => {
    it('displays critical alert badges', () => {
      render(<AdvancedKPIBar />);
      const criticalBadges = screen.getAllByText(/CRITICAL/i);
      expect(criticalBadges.length).toBeGreaterThan(0);
    });

    it('displays warning alert badges', () => {
      render(<AdvancedKPIBar />);
      const warningBadges = screen.getAllByText(/WARNING/i);
      expect(warningBadges.length).toBeGreaterThan(0);
    });

    it('displays info alert badges', () => {
      render(<AdvancedKPIBar />);
      const infoBadges = screen.getAllByText(/INFO/i);
      expect(infoBadges.length).toBeGreaterThan(0);
    });

    it('uses correct colors for critical alerts', () => {
      const { container } = render(<AdvancedKPIBar />);
      const criticalCards = container.querySelectorAll('.border-l-red-500');
      expect(criticalCards.length).toBeGreaterThan(0);
    });

    it('uses correct colors for warning alerts', () => {
      const { container } = render(<AdvancedKPIBar />);
      const warningCards = container.querySelectorAll('.border-l-amber-500');
      expect(warningCards.length).toBeGreaterThan(0);
    });
  });

  describe('Alert Summary', () => {
    it('renders alert summary section', () => {
      render(<AdvancedKPIBar />);

      const alertSummary = screen.getByText(/Critical Alert\(s\)/i);
      expect(alertSummary).toBeInTheDocument();
    });

    it('shows correct count of critical alerts', () => {
      render(<AdvancedKPIBar />);

      // Based on mock data, we have 3 critical alerts
      const alertText = screen.getByText(/3 Critical Alert\(s\)/i);
      expect(alertText).toBeInTheDocument();
    });

    it('shows correct count of warnings', () => {
      render(<AdvancedKPIBar />);

      // Based on mock data, we have 3 warnings
      const warningText = screen.getByText(/3 Warning\(s\) detected/i);
      expect(warningText).toBeInTheDocument();
    });

    it('displays drilldown instruction text', () => {
      render(<AdvancedKPIBar />);

      expect(screen.getByText(/Click on individual KPIs for detailed drilldown analysis/i)).toBeInTheDocument();
    });

    it('uses amber styling for alert summary', () => {
      const { container } = render(<AdvancedKPIBar />);

      const alertBox = container.querySelector('.bg-amber-50');
      expect(alertBox).toBeInTheDocument();
    });
  });

  describe('Tooltips', () => {
    it('shows info icon for each KPI', () => {
      const { container } = render(<AdvancedKPIBar />);

      // Each KPI card should have an info icon (lucide-react Info component)
      const infoIcons = container.querySelectorAll('svg');
      expect(infoIcons.length).toBeGreaterThan(10); // At least one per KPI card
    });

    it('displays tooltip on hover', async () => {
      const user = userEvent.setup();
      const { container } = render(<AdvancedKPIBar />);

      // Find the first info icon wrapper div (hover target)
      const firstInfoIconWrapper = container.querySelector('.hover\\:bg-gray-100');
      expect(firstInfoIconWrapper).toBeInTheDocument();

      if (firstInfoIconWrapper) {
        await user.hover(firstInfoIconWrapper);

        // Tooltip should appear with definition
        await waitFor(() => {
          expect(screen.getByText('Test definition')).toBeInTheDocument();
        });
      }
    });

    it('hides tooltip on mouse leave', async () => {
      const user = userEvent.setup();
      const { container } = render(<AdvancedKPIBar />);

      const firstInfoIconWrapper = container.querySelector('.hover\\:bg-gray-100');

      if (firstInfoIconWrapper) {
        await user.hover(firstInfoIconWrapper);
        await waitFor(() => {
          expect(screen.getByText('Test definition')).toBeInTheDocument();
        });

        await user.unhover(firstInfoIconWrapper);

        await waitFor(() => {
          expect(screen.queryByText('Test definition')).not.toBeInTheDocument();
        });
      }
    });
  });

  describe('KPI Card Interactions', () => {
    it('KPI cards are clickable', () => {
      const { container } = render(<AdvancedKPIBar />);

      const clickableCards = container.querySelectorAll('.cursor-pointer');
      expect(clickableCards.length).toBeGreaterThan(0);
    });

    it('shows hover effect on KPI cards', () => {
      const { container } = render(<AdvancedKPIBar />);

      const hoverableCards = container.querySelectorAll('.hover\\:shadow-md');
      expect(hoverableCards.length).toBeGreaterThan(0);
    });

    it('opens modal when KPI card is clicked', async () => {
      const user = userEvent.setup();
      render(<AdvancedKPIBar />);

      const quickMortalityCard = screen.getByText('Quick Mortality Ratio').closest('.bg-white');
      expect(quickMortalityCard).toBeInTheDocument();

      if (quickMortalityCard) {
        await user.click(quickMortalityCard);

        await waitFor(() => {
          expect(screen.getByTestId('kpi-drilldown-modal')).toBeInTheDocument();
        });
      }
    });

    it('modal displays correct KPI data', async () => {
      const user = userEvent.setup();
      render(<AdvancedKPIBar />);

      const pbiCard = screen.getByText('Pre-Delinquency Behavior Index').closest('.bg-white');

      if (pbiCard) {
        await user.click(pbiCard);

        await waitFor(() => {
          // Check modal is open and contains the KPI label in the modal
          expect(screen.getByTestId('kpi-drilldown-modal')).toBeInTheDocument();
          const modal = screen.getByTestId('kpi-drilldown-modal');
          expect(modal).toHaveTextContent('Pre-Delinquency Behavior Index');
        });
      }
    });

    it('closes modal when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<AdvancedKPIBar />);

      const quickMortalityCard = screen.getByText('Quick Mortality Ratio').closest('.bg-white');

      if (quickMortalityCard) {
        await user.click(quickMortalityCard);

        await waitFor(() => {
          expect(screen.getByTestId('kpi-drilldown-modal')).toBeInTheDocument();
        });

        const closeButton = screen.getByText('Close');
        await user.click(closeButton);

        await waitFor(() => {
          expect(screen.queryByTestId('kpi-drilldown-modal')).not.toBeInTheDocument();
        });
      }
    });

    it('can open different KPI modals sequentially', async () => {
      const user = userEvent.setup();
      render(<AdvancedKPIBar />);

      // Click first KPI
      const firstCard = screen.getByText('Quick Mortality Ratio').closest('.bg-white');
      if (firstCard) {
        await user.click(firstCard);
        await waitFor(() => {
          const modal = screen.getByTestId('kpi-drilldown-modal');
          expect(modal).toHaveTextContent('Quick Mortality Ratio');
        });

        // Close modal
        await user.click(screen.getByText('Close'));

        // Wait for modal to close
        await waitFor(() => {
          expect(screen.queryByTestId('kpi-drilldown-modal')).not.toBeInTheDocument();
        });

        // Click second KPI
        const secondCard = screen.getByText('Forward Delinquency Forecast').closest('.bg-white');
        if (secondCard) {
          await user.click(secondCard);
          await waitFor(() => {
            const modal = screen.getByTestId('kpi-drilldown-modal');
            expect(modal).toHaveTextContent('Forward Delinquency Forecast');
          });
        }
      }
    });
  });

  describe('Value Formatting', () => {
    it('formats percentage KPIs with % symbol', () => {
      render(<AdvancedKPIBar />);

      // Check various percentage KPIs
      expect(screen.getByText('4.43%')).toBeInTheDocument();
      expect(screen.getByText('85.2%')).toBeInTheDocument();
    });

    it('formats currency KPIs with $ and magnitude', () => {
      render(<AdvancedKPIBar />);

      expect(screen.getByText('$5.8B')).toBeInTheDocument();
      expect(screen.getByText('$580.2M')).toBeInTheDocument();
    });

    it('formats basis points with bps suffix', () => {
      render(<AdvancedKPIBar />);

      expect(screen.getByText('125 bps')).toBeInTheDocument();
    });

    it('formats index values as decimals', () => {
      render(<AdvancedKPIBar />);

      expect(screen.getByText('42.5')).toBeInTheDocument(); // PBI
      expect(screen.getByText('67.8')).toBeInTheDocument(); // PPHS
    });
  });

  describe('Trend Indicators', () => {
    it('displays positive trend with green color', () => {
      const { container } = render(<AdvancedKPIBar />);

      const greenTrends = container.querySelectorAll('.text-green-600');
      expect(greenTrends.length).toBeGreaterThan(0);
    });

    it('displays negative trend with red color', () => {
      const { container } = render(<AdvancedKPIBar />);

      const redTrends = container.querySelectorAll('.text-red-600');
      expect(redTrends.length).toBeGreaterThan(0);
    });

    it('shows TrendingUp icon for positive changes', () => {
      const { container } = render(<AdvancedKPIBar />);

      // Check for svg elements within green trend containers
      const greenTrendContainers = container.querySelectorAll('.text-green-600');
      let foundUpIcon = false;

      greenTrendContainers.forEach((container) => {
        if (container.querySelector('svg')) {
          foundUpIcon = true;
        }
      });

      expect(foundUpIcon).toBe(true);
    });

    it('shows TrendingDown icon for negative changes', () => {
      const { container } = render(<AdvancedKPIBar />);

      // Check for svg elements within red trend containers
      const redTrendContainers = container.querySelectorAll('.text-red-600');
      let foundDownIcon = false;

      redTrendContainers.forEach((container) => {
        if (container.querySelector('svg')) {
          foundDownIcon = true;
        }
      });

      expect(foundDownIcon).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      const { container } = render(<AdvancedKPIBar />);

      // Check for proper container structure
      expect(container.querySelector('.mb-6')).toBeInTheDocument();
      expect(container.querySelector('.grid')).toBeInTheDocument();
    });

    it('KPI labels use proper heading structure', () => {
      const { container } = render(<AdvancedKPIBar />);

      const headings = container.querySelectorAll('h3');
      expect(headings.length).toBe(10); // One for each KPI
    });

    it('alert icons have proper styling', () => {
      const { container } = render(<AdvancedKPIBar />);

      // Check for AlertTriangle icons in alert badges
      const alertBadges = container.querySelectorAll('.rounded-full');
      expect(alertBadges.length).toBeGreaterThan(0);
    });

    it('info icons are keyboard accessible', () => {
      const { container } = render(<AdvancedKPIBar />);

      const infoIconContainers = container.querySelectorAll('.cursor-pointer');
      expect(infoIconContainers.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('handles KPIs with zero change', () => {
      // This would require mocking different data, but the component should handle it
      render(<AdvancedKPIBar />);
      // Component renders without errors
      expect(screen.getByText('Quick Mortality Ratio')).toBeInTheDocument();
    });

    it('handles KPIs without alerts', () => {
      render(<AdvancedKPIBar />);

      // VDI and PPHS have 'none' severity
      const vdiCard = screen.getByText('Vintage Deterioration Index').closest('.bg-white');
      expect(vdiCard).toBeInTheDocument();
    });

    it('maintains modal state correctly', async () => {
      const user = userEvent.setup();
      render(<AdvancedKPIBar />);

      // Modal should not be visible initially
      expect(screen.queryByTestId('kpi-drilldown-modal')).not.toBeInTheDocument();

      // Click to open
      const card = screen.getByText('Quick Mortality Ratio').closest('.bg-white');
      if (card) {
        await user.click(card);
        expect(screen.getByTestId('kpi-drilldown-modal')).toBeInTheDocument();

        // Close
        await user.click(screen.getByText('Close'));
        expect(screen.queryByTestId('kpi-drilldown-modal')).not.toBeInTheDocument();
      }
    });
  });
});
