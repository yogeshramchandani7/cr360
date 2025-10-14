import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MultiSelect from './MultiSelect';

describe('MultiSelect', () => {
  const mockOptions = ['Option 1', 'Option 2', 'Option 3'];
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders label and placeholder', () => {
    render(
      <MultiSelect
        label="Test Label"
        options={mockOptions}
        selected={[]}
        onChange={mockOnChange}
        placeholder="Select items"
      />
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Select items')).toBeInTheDocument();
  });

  it('displays selected count when multiple items selected', () => {
    render(
      <MultiSelect
        label="Test Label"
        options={mockOptions}
        selected={['Option 1', 'Option 2']}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('2 selected')).toBeInTheDocument();
  });

  it('displays single selected item name', () => {
    render(
      <MultiSelect
        label="Test Label"
        options={mockOptions}
        selected={['Option 1']}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('opens dropdown on button click', () => {
    render(
      <MultiSelect
        label="Test Label"
        options={mockOptions}
        selected={[]}
        onChange={mockOnChange}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Check if options are visible
    expect(screen.getByText('Select All')).toBeInTheDocument();
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('displays all options when open', () => {
    render(
      <MultiSelect
        label="Test Label"
        options={mockOptions}
        selected={[]}
        onChange={mockOnChange}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    mockOptions.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('selects an option when clicked', () => {
    render(
      <MultiSelect
        label="Test Label"
        options={mockOptions}
        selected={[]}
        onChange={mockOnChange}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const option1 = screen.getByLabelText('Option 1');
    fireEvent.click(option1);

    expect(mockOnChange).toHaveBeenCalledWith(['Option 1']);
  });

  it('deselects an option when clicked again', () => {
    render(
      <MultiSelect
        label="Test Label"
        options={mockOptions}
        selected={['Option 1']}
        onChange={mockOnChange}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const option1 = screen.getByLabelText('Option 1');
    fireEvent.click(option1);

    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it('selects all options when Select All clicked', () => {
    render(
      <MultiSelect
        label="Test Label"
        options={mockOptions}
        selected={[]}
        onChange={mockOnChange}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const selectAllButton = screen.getByText('Select All');
    fireEvent.click(selectAllButton);

    expect(mockOnChange).toHaveBeenCalledWith(mockOptions);
  });

  it('clears all selections when Clear All clicked', () => {
    render(
      <MultiSelect
        label="Test Label"
        options={mockOptions}
        selected={['Option 1', 'Option 2']}
        onChange={mockOnChange}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const clearAllButton = screen.getByText('Clear All');
    fireEvent.click(clearAllButton);

    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it('rotates chevron icon when dropdown is open', () => {
    const { container } = render(
      <MultiSelect
        label="Test Label"
        options={mockOptions}
        selected={[]}
        onChange={mockOnChange}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const chevron = container.querySelector('.lucide-chevron-down');
    expect(chevron).toHaveClass('rotate-180');
  });

  it('shows "No options available" when options array is empty', () => {
    render(
      <MultiSelect
        label="Test Label"
        options={[]}
        selected={[]}
        onChange={mockOnChange}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('No options available')).toBeInTheDocument();
  });

  it('applies primary border color when items are selected', () => {
    const { container } = render(
      <MultiSelect
        label="Test Label"
        options={mockOptions}
        selected={['Option 1']}
        onChange={mockOnChange}
      />
    );

    const button = container.querySelector('button');
    expect(button).toHaveClass('border-primary');
  });

  it('shows checkmark for selected options', () => {
    render(
      <MultiSelect
        label="Test Label"
        options={mockOptions}
        selected={['Option 1']}
        onChange={mockOnChange}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Check for checkmark SVG
    const checkmarks = screen.getAllByRole('checkbox', { checked: true });
    expect(checkmarks).toHaveLength(1);
  });
});
