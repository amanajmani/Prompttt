import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal, Dialog, ConfirmDialog } from '../Modal'

describe('Modal Component', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
    // Reset body overflow
    document.body.style.overflow = ''
  })

  describe('Basic functionality', () => {
    it('does not render when closed', () => {
      render(
        <Modal isOpen={false} onClose={mockOnClose}>
          <div>Modal content</div>
        </Modal>
      )

      expect(screen.queryByText('Modal content')).not.toBeInTheDocument()
    })

    it('renders when open', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal content</div>
        </Modal>
      )

      expect(screen.getByText('Modal content')).toBeInTheDocument()
    })

    it('renders title and description when provided', () => {
      render(
        <Modal 
          isOpen={true} 
          onClose={mockOnClose}
          title="Test Modal"
          description="Test description"
        >
          <div>Modal content</div>
        </Modal>
      )

      expect(screen.getByText('Test Modal')).toBeInTheDocument()
      expect(screen.getByText('Test description')).toBeInTheDocument()
    })

    it('renders close button by default', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal content</div>
        </Modal>
      )

      expect(screen.getByLabelText('Close modal')).toBeInTheDocument()
    })

    it('hides close button when showCloseButton is false', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} showCloseButton={false}>
          <div>Modal content</div>
        </Modal>
      )

      expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument()
    })
  })

  describe('Size variants', () => {
    it('applies correct size classes', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose} size="sm">
          <div>Content</div>
        </Modal>
      )

      let modal = screen.getByText('Content').closest('[role="dialog"]')
      expect(modal).toHaveClass('max-w-sm')

      rerender(
        <Modal isOpen={true} onClose={mockOnClose} size="lg">
          <div>Content</div>
        </Modal>
      )

      modal = screen.getByText('Content').closest('[role="dialog"]')
      expect(modal).toHaveClass('max-w-lg')

      rerender(
        <Modal isOpen={true} onClose={mockOnClose} size="full">
          <div>Content</div>
        </Modal>
      )

      modal = screen.getByText('Content').closest('[role="dialog"]')
      expect(modal).toHaveClass('max-w-full')
    })
  })

  describe('Interaction handling', () => {
    it('closes when close button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal content</div>
        </Modal>
      )

      const closeButton = screen.getByLabelText('Close modal')
      await user.click(closeButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('closes when overlay is clicked by default', async () => {
      const user = userEvent.setup()
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal content</div>
        </Modal>
      )

      const overlay = screen.getByText('Modal content').closest('[role="dialog"]')?.parentElement
      if (overlay) {
        await user.click(overlay)
        expect(mockOnClose).toHaveBeenCalledTimes(1)
      }
    })

    it('does not close when overlay is clicked if closeOnOverlayClick is false', async () => {
      const user = userEvent.setup()
      render(
        <Modal isOpen={true} onClose={mockOnClose} closeOnOverlayClick={false}>
          <div>Modal content</div>
        </Modal>
      )

      const overlay = screen.getByText('Modal content').closest('[role="dialog"]')?.parentElement
      if (overlay) {
        await user.click(overlay)
        expect(mockOnClose).not.toHaveBeenCalled()
      }
    })

    it('does not close when modal content is clicked', async () => {
      const user = userEvent.setup()
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal content</div>
        </Modal>
      )

      const content = screen.getByText('Modal content')
      await user.click(content)

      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('Keyboard handling', () => {
    it('closes when Escape key is pressed by default', async () => {
      const user = userEvent.setup()
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal content</div>
        </Modal>
      )

      await user.keyboard('{Escape}')
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('does not close when Escape key is pressed if closeOnEscape is false', async () => {
      const user = userEvent.setup()
      render(
        <Modal isOpen={true} onClose={mockOnClose} closeOnEscape={false}>
          <div>Modal content</div>
        </Modal>
      )

      await user.keyboard('{Escape}')
      expect(mockOnClose).not.toHaveBeenCalled()
    })

    it('implements focus trap with Tab navigation', async () => {
      const user = userEvent.setup()
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>
            <button>First button</button>
            <button>Second button</button>
            <button>Third button</button>
          </div>
        </Modal>
      )

      // Focus should start on the first focusable element
      await waitFor(() => {
        expect(screen.getByText('First button')).toHaveFocus()
      })

      // Tab to second button
      await user.keyboard('{Tab}')
      expect(screen.getByText('Second button')).toHaveFocus()

      // Tab to third button
      await user.keyboard('{Tab}')
      expect(screen.getByText('Third button')).toHaveFocus()

      // Tab to close button
      await user.keyboard('{Tab}')
      expect(screen.getByLabelText('Close modal')).toHaveFocus()

      // Tab should wrap back to first button
      await user.keyboard('{Tab}')
      expect(screen.getByText('First button')).toHaveFocus()
    })

    it('implements reverse focus trap with Shift+Tab', async () => {
      const user = userEvent.setup()
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>
            <button>First button</button>
            <button>Second button</button>
          </div>
        </Modal>
      )

      // Focus should start on the first button
      await waitFor(() => {
        expect(screen.getByText('First button')).toHaveFocus()
      })

      // Shift+Tab should wrap to the last focusable element (close button)
      await user.keyboard('{Shift>}{Tab}{/Shift}')
      expect(screen.getByLabelText('Close modal')).toHaveFocus()
    })
  })

  describe('Focus management', () => {
    it('focuses first focusable element when opened', async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>
            <button>Focusable button</button>
            <div>Non-focusable content</div>
          </div>
        </Modal>
      )

      await waitFor(() => {
        expect(screen.getByText('Focusable button')).toHaveFocus()
      })
    })

    it('focuses modal container when no focusable elements exist', async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Non-focusable content</div>
        </Modal>
      )

      const modal = screen.getByRole('dialog')
      await waitFor(() => {
        expect(modal).toHaveFocus()
      })
    })

    it('prevents body scroll when open', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal content</div>
        </Modal>
      )

      expect(document.body.style.overflow).toBe('hidden')
    })

    it('restores body scroll when closed', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal content</div>
        </Modal>
      )

      expect(document.body.style.overflow).toBe('hidden')

      rerender(
        <Modal isOpen={false} onClose={mockOnClose}>
          <div>Modal content</div>
        </Modal>
      )

      expect(document.body.style.overflow).toBe('')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>Modal content</div>
        </Modal>
      )

      const modal = screen.getByRole('dialog')
      expect(modal).toHaveAttribute('aria-modal', 'true')
      expect(modal).toHaveAttribute('aria-labelledby')
    })

    it('has proper heading structure', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>Modal content</div>
        </Modal>
      )

      const heading = screen.getByRole('heading', { name: 'Test Modal' })
      expect(heading).toBeInTheDocument()
    })

    it('close button has proper accessibility attributes', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal content</div>
        </Modal>
      )

      const closeButton = screen.getByLabelText('Close modal')
      expect(closeButton).toHaveAttribute('type', 'button')
    })
  })
})

describe('Dialog Component', () => {
  it('renders as Modal with dialog semantics', () => {
    render(
      <Dialog isOpen={true} onClose={jest.fn()}>
        <div>Dialog content</div>
      </Dialog>
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Dialog content')).toBeInTheDocument()
  })
})

describe('ConfirmDialog Component', () => {
  const mockOnConfirm = jest.fn()
  const mockOnClose = jest.fn()

  beforeEach(() => {
    mockOnConfirm.mockClear()
    mockOnClose.mockClear()
  })

  it('renders with title and message', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Confirm Action"
        description="Are you sure you want to proceed?"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('Confirm Action')).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument()
  })

  it('renders confirm and cancel buttons', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Confirm"
        description="Message"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('Confirm')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <ConfirmDialog
        isOpen={true}
        title="Confirm"
        description="Message"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    )

    const confirmButton = screen.getByText('Confirm')
    await user.click(confirmButton)

    expect(mockOnConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <ConfirmDialog
        isOpen={true}
        title="Confirm"
        description="Message"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    )

    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('renders custom button labels', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete Item"
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Keep"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('Delete')).toBeInTheDocument()
    expect(screen.getByText('Keep')).toBeInTheDocument()
  })

  it('applies destructive styling to confirm button when type is destructive', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete"
        description="Delete this item?"
        variant="destructive"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    )

    const confirmButton = screen.getByText('Confirm')
    expect(confirmButton).toHaveClass('bg-red-600')
  })

  it('shows loading state when isLoading is true', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Confirm"
        description="Message"
        isLoading={true}
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    )

    const confirmButton = screen.getByText('Confirm')
    expect(confirmButton).toBeDisabled()
  })
})