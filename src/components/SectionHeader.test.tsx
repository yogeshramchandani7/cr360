import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SectionHeader from './SectionHeader';

describe('SectionHeader', () => {
  beforeEach(() => {
    // Mock window.open
    vi.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('displays title', () => {
    render(<SectionHeader title="Test Section" />);

    expect(screen.getByText('Test Section')).toBeInTheDocument();
  });

  it('renders without View Details button when detailsRoute is not provided', () => {
    render(<SectionHeader title="Test Section" />);

    expect(screen.queryByText('View Details')).not.toBeInTheDocument();
  });

  it('renders without View Details button when companyId is not provided', () => {
    render(<SectionHeader title="Test Section" detailsRoute="/details/:id" />);

    expect(screen.queryByText('View Details')).not.toBeInTheDocument();
  });

  it('renders View Details button when both detailsRoute and companyId are provided', () => {
    render(
      <SectionHeader
        title="Test Section"
        detailsRoute="/details/:id"
        companyId="portfolio-1"
      />
    );

    expect(screen.getByText('View Details')).toBeInTheDocument();
  });

  it('opens details route in new window when View Details is clicked', () => {
    render(
      <SectionHeader
        title="Test Section"
        detailsRoute="/details/:id"
        companyId="portfolio-1"
      />
    );

    const button = screen.getByText('View Details');
    fireEvent.click(button);

    expect(window.open).toHaveBeenCalledWith(
      '/details/portfolio-1',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('replaces :id placeholder with actual companyId', () => {
    render(
      <SectionHeader
        title="Test Section"
        detailsRoute="/risk/:id/summary"
        companyId="comp-123"
      />
    );

    const button = screen.getByText('View Details');
    fireEvent.click(button);

    expect(window.open).toHaveBeenCalledWith(
      '/risk/comp-123/summary',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('renders ExternalLink icon', () => {
    const { container } = render(
      <SectionHeader
        title="Test Section"
        detailsRoute="/details/:id"
        companyId="portfolio-1"
      />
    );

    const icon = container.querySelector('.lucide-external-link');
    expect(icon).toBeInTheDocument();
  });

  it('applies proper flexbox layout', () => {
    const { container } = render(
      <SectionHeader title="Test Section" />
    );

    const wrapper = container.querySelector('.flex.items-center.justify-between');
    expect(wrapper).toBeInTheDocument();
  });

  it('applies correct styling to title', () => {
    render(<SectionHeader title="Test Section" />);

    const title = screen.getByText('Test Section');
    expect(title).toHaveClass('text-lg', 'font-semibold', 'text-gray-900');
  });

  it('applies hover styles to View Details button', () => {
    const { container } = render(
      <SectionHeader
        title="Test Section"
        detailsRoute="/details/:id"
        companyId="portfolio-1"
      />
    );

    const button = container.querySelector('button');
    expect(button).toHaveClass('text-blue-600', 'hover:text-blue-800', 'hover:underline');
  });
});
