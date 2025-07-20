import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '../dialog';

describe('Dialog', () => {
  it('is not visible initially', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>This is a test dialog</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByText('Open Dialog')).toBeInTheDocument();
    expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
  });

  it('becomes visible after clicking the trigger', async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>This is a test dialog</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open Dialog'));

    await waitFor(() => {
      expect(screen.getByText('Test Dialog')).toBeInTheDocument();
      expect(screen.getByText('This is a test dialog')).toBeInTheDocument();
    });
  });

  it('moves focus into the dialog when it opens', async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>This is a test dialog</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button>Cancel</button>
            <button>Confirm</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open Dialog'));

    await waitFor(() => {
      const dialogContent = screen.getByRole('dialog');
      expect(dialogContent).toBeInTheDocument();
      // Focus should be within the dialog
      expect(document.activeElement).not.toBe(document.body);
    });
  });

  it('closes when escape key is pressed', async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>
              This is a test dialog for keyboard navigation testing.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open Dialog'));

    await waitFor(() => {
      expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
    });
  });

  it('closes when close button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>
              This is a test dialog for close button testing.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open Dialog'));

    await waitFor(() => {
      expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
    });
  });

  it('renders all dialog components correctly', async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description text</DialogDescription>
          </DialogHeader>
          <div>Dialog body content</div>
          <DialogFooter>
            <button>Footer Button</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open Dialog'));

    await waitFor(() => {
      expect(screen.getByText('Dialog Title')).toBeInTheDocument();
      expect(screen.getByText('Dialog description text')).toBeInTheDocument();
      expect(screen.getByText('Dialog body content')).toBeInTheDocument();
      expect(screen.getByText('Footer Button')).toBeInTheDocument();
    });
  });

  it('applies custom className to components', async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent className="custom-content">
          <DialogHeader className="custom-header">
            <DialogTitle className="custom-title">Title</DialogTitle>
            <DialogDescription className="custom-description">
              Description
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="custom-footer">
            <button>Button</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open Dialog'));

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('custom-content');

      const title = screen.getByText('Title');
      expect(title).toHaveClass('custom-title');

      const description = screen.getByText('Description');
      expect(description).toHaveClass('custom-description');
    });
  });
});
