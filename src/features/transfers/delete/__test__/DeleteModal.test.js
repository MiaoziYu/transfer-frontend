import React from 'react'
import { setupServer } from 'msw/node'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { TransfersListContainer } from '../../list/TransfersListContainer'
import { DeleteConfirmationModal } from '../DeleteConfirmationModal'
import { renderWithProviders } from '../../../../tests/helpers'
import preloadedState from '../../../../tests/data/preloadedState'

// We use msw to intercept the network request during the test,
// and return the response
import { requestHandlers } from '../../../../tests/requestHandlers'

const server = setupServer(...requestHandlers);

describe('Delete button', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

  beforeEach(() => {
    renderWithProviders(
      <>
        <TransfersListContainer />
        <DeleteConfirmationModal />
      </>,
      preloadedState
    );
  });

  // Reset any runtime request handlers we may add during the tests.
  afterEach(() => server.resetHandlers());

  // Disable API mocking after the tests are done.
  afterAll(() => server.close());

  it('should activate delete modal', async () => {
    // Arrange
    const modalButton = await screen.findByRole('delete0');

    // Act
    fireEvent.click(modalButton);

    // Assert
    const modal = await screen.findByRole('modal');
    expect(modal).toContainElement(await screen.findByText(/Delete this transfer?/i));
    expect(modal).toContainElement(await screen.findByRole('cancelDelete'));
    expect(modal).toContainElement(await screen.findByRole('confirmDelete'));
  });

  it('should close the modal by clicking cancel button', async () => {
    // Arrange
    const modalButton = await screen.findByRole('delete0');

    // Act
    fireEvent.click(modalButton);

    const cancelButton = await screen.findByRole('cancelDelete');
    fireEvent.click(cancelButton);

    // Assert
    await waitFor(() => {
      expect(screen.queryByRole('modal')).not.toBeInTheDocument();
      expect(screen.queryByText(/Delete this transfer?/i)).not.toBeInTheDocument();
    });
  });

  it('should delete the transfer by clicking delete button', async () => {
    // Arrange
    const modalButton = await screen.findByRole('delete0');

    // Act
    fireEvent.click(modalButton);

    const confirmButton = await screen.findByRole('confirmDelete');
    fireEvent.click(confirmButton);

    // Assert
    await waitFor(() => {
      expect(screen.queryByRole('modal')).not.toBeInTheDocument();
      expect(screen.queryByText(/Delete this transfer?/i)).not.toBeInTheDocument();
    });
  });
});
