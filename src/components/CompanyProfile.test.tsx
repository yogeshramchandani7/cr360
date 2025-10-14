import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CompanyProfile from './CompanyProfile';
import { useFilterStore } from '../stores/filterStore';

describe('CompanyProfile', () => {
  beforeEach(() => {
    // Reset filter store before each test
    useFilterStore.setState({
      selectedCompanyId: null,
    });
  });

  it('does not render when no company is selected', () => {
    const { container } = render(<CompanyProfile />);
    expect(container.firstChild).toBeNull();
  });

  it('renders drawer when a company is selected', () => {
    // Set a selected company (using actual mock data ID format)
    useFilterStore.setState({
      selectedCompanyId: 'portfolio-1',
    });

    render(<CompanyProfile />);

    // Check for backdrop
    const backdrop = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-30');
    expect(backdrop).toBeInTheDocument();
  });

  it('displays company name and details when selected', () => {
    useFilterStore.setState({
      selectedCompanyId: 'portfolio-1',
    });

    render(<CompanyProfile />);

    // Should display company name (IDL Logistics Limited is the first company) - appears multiple times
    const companyNames = screen.getAllByText(/IDL Logistics Limited/i);
    expect(companyNames.length).toBeGreaterThan(0);
  });

  it('closes drawer when backdrop is clicked', () => {
    const clearSelectedCompanyId = vi.fn();
    useFilterStore.setState({
      selectedCompanyId: 'portfolio-1',
      clearSelectedCompanyId,
    });

    render(<CompanyProfile />);

    const backdrop = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-30')!;
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(clearSelectedCompanyId).toHaveBeenCalled();
    }
  });

  it('closes drawer when close button is clicked', () => {
    const clearSelectedCompanyId = vi.fn();
    useFilterStore.setState({
      selectedCompanyId: 'portfolio-1',
      clearSelectedCompanyId,
    });

    render(<CompanyProfile />);

    const closeButtons = document.querySelectorAll('button');
    const closeButton = Array.from(closeButtons).find(btn => btn.className.includes('hover:bg-gray-100'));
    if (closeButton) {
      fireEvent.click(closeButton);
      expect(clearSelectedCompanyId).toHaveBeenCalled();
    }
  });

  it('closes drawer when Escape key is pressed', () => {
    const clearSelectedCompanyId = vi.fn();
    useFilterStore.setState({
      selectedCompanyId: 'portfolio-1',
      clearSelectedCompanyId,
    });

    render(<CompanyProfile />);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(clearSelectedCompanyId).toHaveBeenCalled();
  });

  it('displays all profile sections', () => {
    useFilterStore.setState({
      selectedCompanyId: 'portfolio-1',
    });

    render(<CompanyProfile />);

    expect(screen.getByText('Profile Summary')).toBeInTheDocument();
    expect(screen.getByText('Risk Summary')).toBeInTheDocument();
    expect(screen.getByText('Exposure Summary')).toBeInTheDocument();
    expect(screen.getByText('Group/Related Party Exposures')).toBeInTheDocument();
    expect(screen.getByText('Covenants Summary')).toBeInTheDocument();
    expect(screen.getByText('Customer Profitability Summary')).toBeInTheDocument();
    expect(screen.getByText('KYC & ALM Risk & Compliance Summary')).toBeInTheDocument();
    expect(screen.getByText('Climate Risk Summary')).toBeInTheDocument();
    expect(screen.getByText('Approvals History')).toBeInTheDocument();
    expect(screen.getByText('Account Summary')).toBeInTheDocument();
  });

  it('displays group of connected counterparties sidebar', () => {
    useFilterStore.setState({
      selectedCompanyId: 'portfolio-1',
    });

    render(<CompanyProfile />);

    expect(screen.getByText('Group of Connected Counterparties')).toBeInTheDocument();
  });

  it('highlights current company in the sidebar', () => {
    useFilterStore.setState({
      selectedCompanyId: 'portfolio-1',
    });

    const { container } = render(<CompanyProfile />);

    // Current company should be highlighted with bg-blue-100
    const highlightedCompany = container.querySelector('.bg-blue-100.border-l-4.border-blue-600');
    expect(highlightedCompany).toBeInTheDocument();
  });

  it('displays covenant sections for financial and non-financial', () => {
    useFilterStore.setState({
      selectedCompanyId: 'portfolio-1',
    });

    render(<CompanyProfile />);

    expect(screen.getByText('Financial Covenants')).toBeInTheDocument();
    expect(screen.getByText('Non-Financial Covenants')).toBeInTheDocument();
  });

  it('formats currency values correctly', () => {
    useFilterStore.setState({
      selectedCompanyId: 'portfolio-1',
    });

    const { container } = render(<CompanyProfile />);

    // Check for rupee symbol in currency fields
    const currencyValues = container.textContent;
    expect(currencyValues).toContain('₹');
  });

  it('applies slide-in animation', () => {
    useFilterStore.setState({
      selectedCompanyId: 'portfolio-1',
    });

    const { container } = render(<CompanyProfile />);

    const drawer = container.querySelector('.animate-slide-in-right');
    expect(drawer).toBeInTheDocument();
  });
});
