import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterBar from './FilterBar';
import { useFilterStore } from '../stores/filterStore';

describe('FilterBar', () => {
  beforeEach(() => {
    // Reset filter store before each test
    useFilterStore.setState({
      lob: [],
      partyType: [],
      rating: [],
      assetClassification: [],
    });
  });

  it('renders filter label', () => {
    render(<FilterBar />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('renders all filter dropdowns', () => {
    render(<FilterBar />);

    expect(screen.getByText('LOB')).toBeInTheDocument();
    expect(screen.getByText('Party Type')).toBeInTheDocument();
    expect(screen.getByText('Rating')).toBeInTheDocument();
    expect(screen.getByText('Asset Classification')).toBeInTheDocument();
  });

  it('does not show "Clear All Filters" button when no filters are active', () => {
    render(<FilterBar />);
    expect(screen.queryByText('Clear All Filters')).not.toBeInTheDocument();
  });

  it('shows "Clear All Filters" button when filters are active', () => {
    // Set some filters
    useFilterStore.setState({
      lob: ['Corporate'],
      partyType: [],
      rating: [],
      assetClassification: [],
    });

    render(<FilterBar />);
    expect(screen.getByText('Clear All Filters')).toBeInTheDocument();
  });

  it('clears all filters when "Clear All Filters" is clicked', () => {
    // Set some filters
    useFilterStore.setState({
      lob: ['Corporate'],
      partyType: ['Individual'],
      rating: ['AAA'],
      assetClassification: ['Standard'],
    });

    render(<FilterBar />);

    const clearButton = screen.getByText('Clear All Filters');
    fireEvent.click(clearButton);

    // Check that filters are cleared in the store
    const state = useFilterStore.getState();
    expect(state.lob).toEqual([]);
    expect(state.partyType).toEqual([]);
    expect(state.rating).toEqual([]);
    expect(state.assetClassification).toEqual([]);
  });

  it('applies proper styling classes', () => {
    const { container } = render(<FilterBar />);

    const filterBar = container.querySelector('.bg-white.border-b.border-gray-200');
    expect(filterBar).toBeInTheDocument();
  });

  it('displays filters in a flex layout', () => {
    const { container } = render(<FilterBar />);

    const flexContainer = container.querySelector('.flex.items-center.gap-4');
    expect(flexContainer).toBeInTheDocument();
  });
});
