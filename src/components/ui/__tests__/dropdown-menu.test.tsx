import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
} from '../dropdown-menu';

describe('DropdownMenu', () => {
  it('is not visible initially', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByText('Open Menu')).toBeInTheDocument();
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
  });

  it('makes menu items visible when trigger is clicked', async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText('Open Menu'));

    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

  it('calls onSelect when menu item is clicked', async () => {
    const user = userEvent.setup();
    const handleSelect = jest.fn();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={handleSelect}>
            Clickable Item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText('Open Menu'));

    await waitFor(() => {
      expect(screen.getByText('Clickable Item')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Clickable Item'));

    expect(handleSelect).toHaveBeenCalledTimes(1);
  });

  it('renders all dropdown components correctly', async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Menu Label</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Regular Item
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem checked>
            Checkbox Item
          </DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value="option1">
            <DropdownMenuRadioItem value="option1">
              Radio Option 1
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="option2">
              Radio Option 2
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText('Open Menu'));

    await waitFor(() => {
      expect(screen.getByText('Menu Label')).toBeInTheDocument();
      expect(screen.getByText('Regular Item')).toBeInTheDocument();
      expect(screen.getByText('⌘K')).toBeInTheDocument();
      expect(screen.getByText('Checkbox Item')).toBeInTheDocument();
      expect(screen.getByText('Radio Option 1')).toBeInTheDocument();
      expect(screen.getByText('Radio Option 2')).toBeInTheDocument();
    });
  });

  it('handles checkbox item state changes', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = jest.fn();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem
            checked={false}
            onCheckedChange={handleCheckedChange}
          >
            Toggle Item
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText('Open Menu'));

    await waitFor(() => {
      expect(screen.getByText('Toggle Item')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Toggle Item'));

    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it('handles radio item selection', async () => {
    const user = userEvent.setup();
    const handleValueChange = jest.fn();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup
            value="option1"
            onValueChange={handleValueChange}
          >
            <DropdownMenuRadioItem value="option1">
              Option 1
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="option2">
              Option 2
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText('Open Menu'));

    await waitFor(() => {
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Option 2'));

    expect(handleValueChange).toHaveBeenCalledWith('option2');
  });

  it('applies custom className to components', async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent className="custom-content">
          <DropdownMenuLabel className="custom-label">Label</DropdownMenuLabel>
          <DropdownMenuItem className="custom-item">Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText('Open Menu'));

    await waitFor(() => {
      const label = screen.getByText('Label');
      expect(label).toHaveClass('custom-label');

      const item = screen.getByText('Item');
      expect(item).toHaveClass('custom-item');
    });
  });

  it('closes menu when pressing escape key', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div>Outside element</div>
      </div>
    );

    await user.click(screen.getByText('Open Menu'));

    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    // Use escape key instead of clicking outside to avoid pointer-events issues
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    });
  });
});
