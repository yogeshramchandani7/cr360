import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InsightButton from './InsightButton';

describe('InsightButton', () => {
  it('renders with correct insight count', () => {
    render(<InsightButton chartId="test-chart" insightCount={3} onClick={() => {}} />);

    expect(screen.getByText('3 insights')).toBeInTheDocument();
  });

  it('shows singular text when count is 1', () => {
    render(<InsightButton chartId="test-chart" insightCount={1} onClick={() => {}} />);

    expect(screen.getByText('1 insight')).toBeInTheDocument();
  });

  it('shows plural text when count is greater than 1', () => {
    render(<InsightButton chartId="test-chart" insightCount={5} onClick={() => {}} />);

    expect(screen.getByText('5 insights')).toBeInTheDocument();
  });

  it('does not render when insightCount is 0', () => {
    const { container } = render(
      <InsightButton chartId="test-chart" insightCount={0} onClick={() => {}} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('triggers onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<InsightButton chartId="test-chart" insightCount={2} onClick={handleClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies hover effects with gradient background', () => {
    const { container } = render(
      <InsightButton chartId="test-chart" insightCount={3} onClick={() => {}} />
    );

    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-gradient-to-r', 'from-blue-50', 'to-blue-100');
    expect(button).toHaveClass('hover:from-blue-100', 'hover:to-blue-200');
  });

  it('renders Sparkles icon', () => {
    const { container } = render(
      <InsightButton chartId="test-chart" insightCount={2} onClick={() => {}} />
    );

    // Check for SVG icon
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('lucide-sparkles');
  });

  it('applies proper styling classes', () => {
    const { container } = render(
      <InsightButton chartId="test-chart" insightCount={2} onClick={() => {}} />
    );

    const button = container.querySelector('button');
    expect(button).toHaveClass('inline-flex', 'items-center', 'gap-2');
    expect(button).toHaveClass('border', 'border-blue-200', 'rounded-lg');
  });
});
