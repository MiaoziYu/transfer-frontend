import React from 'react'
import { setupServer } from 'msw/node'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { TransfersListContainer } from '../TransfersListContainer'
import { renderWithProviders } from '../../../../tests/helpers'
import preloadedState from '../../../../tests/data/preloadedState'

// We use msw to intercept the network request during the test,
// and return the response
import { requestHandlers } from '../../../../tests/requestHandlers'

const server = setupServer(...requestHandlers);

describe('TransferList', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

  beforeEach(() => {
    renderWithProviders(<TransfersListContainer />, preloadedState);
  });

  // Reset any runtime request handlers we may add during the tests.
  afterEach(() => server.resetHandlers());

  // Disable API mocking after the tests are done.
  afterAll(() => server.close());

  it('should fetche and render transfers', async () => {
    // Assert
    expect(await screen.findByText(/Max Mustermann/i)).toBeInTheDocument()
    expect(await screen.findByText(/Max Musterfrau/i)).toBeInTheDocument()
    expect(await screen.findAllByRole('dataRow')).toHaveLength(2);
  });

  describe('Search Input', () => {
    it('should filter transfer list by account holder', async () => {
      // Arrange
      const input = await screen.findByRole('textbox');

      // Act
      fireEvent.change(input, {target: {value: 'frau'}})

      // Assert
      expect(input.value).toBe('frau')
      await waitFor(() => {
        expect(screen.queryByText(/Max Musterfrau/i)).toBeInTheDocument();
        expect(screen.queryByText(/Max Mustermann/i)).not.toBeInTheDocument();
      });
    });

    it('should filter transfer list by note', async () => {
      // Arrange
      const input = await screen.findByRole('textbox');

      // Act
      fireEvent.change(input, {target: {value: 'first'}})

      // Assert
      expect(input.value).toBe('first')
      await waitFor(() => {
        expect(screen.queryByText(/Max Mustermann/i)).toBeInTheDocument();
        expect(screen.queryByText(/Max Musterfrau/i)).not.toBeInTheDocument();
      });
    });

    it('should show all transfers when search input is cleared', async () => {
      // Arrange
      const input = await screen.findByRole('textbox');

      // Act
      fireEvent.change(input, {target: {value: 'frau'}})

      // Assert
      expect(input.value).toBe('frau')
      await waitFor(() => {
        expect(screen.queryByText(/Max Musterfrau/i)).toBeInTheDocument();
        expect(screen.queryByText(/Max Mustermann/i)).not.toBeInTheDocument();
      });

      // empty the input
      fireEvent.change(input, {target: {value: ''}})

      // Assert
      expect(input.value).toBe('')
      await waitFor(() => {
        expect(screen.queryByText(/Max Musterfrau/i)).toBeInTheDocument();
        expect(screen.queryByText(/Max Mustermann/i)).toBeInTheDocument();
      });
    });
  });

  describe('Sort buttons', () => {
    it('should sort transfers by amount', async () => {
      // Arrange
      const sortButton = await screen.findByRole('sortByAmount');

      // Act
      fireEvent.click(sortButton)

      // Assert
      let transfers = await screen.findAllByRole('dataRow');
      expect(transfers[0]).toHaveTextContent(/Musterfrau/i);

      // click again to sort in ascending order
      fireEvent.click(sortButton)

      // Assert
      transfers = await screen.findAllByRole('dataRow');
      expect(transfers[0]).toHaveTextContent(/MusterMann/i);
    });

    it('should sort transfers by date', async () => {
      // Arrange
      const sortButton = await screen.findByRole('sortByDate');

      // Act
      fireEvent.click(sortButton)

      // Assert
      let transfers = await screen.findAllByRole('dataRow');
      expect(transfers[0]).toHaveTextContent(/MusterMann/i);

      // click again to sort in ascending order
      fireEvent.click(sortButton)

      // Assert
      transfers = await screen.findAllByRole('dataRow');
      expect(transfers[0]).toHaveTextContent(/Musterfrau/i);
    });
  });
});