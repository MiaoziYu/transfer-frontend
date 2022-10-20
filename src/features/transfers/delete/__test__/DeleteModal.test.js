import { fireEvent, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import Notification from '../../../../components/Notification';
import { configServer } from '../../../../testUtils/configServer';
import { TransfersListContainer } from '../../list/TransfersListContainer';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';

const component = <>
  <TransfersListContainer />
  <DeleteConfirmationModal />
  <Notification />
</>

// We use msw to intercept the network request during the test,
// and return the response
const fakeServer = configServer(component);

const openModal = async () => {
  fireEvent.click((await screen.findAllByRole('deleteButton'))[0]);
};

describe('Delete button on transferlist', () => {
  it('should activate delete modal', async () => {
    // Act
    fireEvent.click((await screen.findAllByRole('deleteButton'))[0]);

    // Assert
    const modal = await screen.findByRole('modal');
    expect(modal).toContainElement(await screen.findByText(/Delete this transfer?/i));
    expect(modal).toContainElement(await screen.findByRole('button', {name: /Cancel/i}));
    expect(modal).toContainElement(await screen.findByRole('button', {name: /Delete/i}));
  });
});

describe('Delete cancel button', () => {
  it('should close the modal', async () => {
    // Act
    openModal();
    fireEvent.click(await screen.findByRole('button', {name: /Cancel/i}));

    // Assert
    expect(screen.queryByRole('modal')).not.toBeInTheDocument();
    expect(screen.queryByText(/Delete this transfer?/i)).not.toBeInTheDocument();
  });
});

describe('Delete confirm button', () => {
  it('should delete the transfer', async () => {
    // Act
    openModal();
    fireEvent.click(await screen.findByRole('button', {name: /Delete/i}));

    // Assert
    // check if transfer was successfully deleted
    await waitFor(() => expect(screen.queryByText(/Max Mustermann/i)).not.toBeInTheDocument());
    expect(screen.getByText(/Max Musterfrau/i)).toBeInTheDocument();
    expect(screen.getAllByRole('dataRow')).toHaveLength(1);

    // check if notification has been triggered
    expect(screen.getByRole('notification')).toHaveTextContent(('Transfer deleted'));

    // check if modal has been closed
    expect(screen.queryByRole('modal')).not.toBeInTheDocument();
    expect(screen.queryByText(/Delete this transfer?/i)).not.toBeInTheDocument();
  });

  it('should handle error when delete request failed', async () => {
    // Arrange
    // In this paticular test respond to the same request with a 404 response.
    fakeServer.use(
      rest.delete(`${process.env.REACT_APP_API_BASE_URL}/transfer/:transferId`, (req, res, ctx) => {
        return res(ctx.status(404))
      })
    )

    // Act
    openModal();
    fireEvent.click(await screen.findByRole('button', {name: /Delete/i}));

    // Assert
    // check if all transfers are still there
    expect(screen.getByText(/Max Mustermann/i)).toBeInTheDocument();
    expect(screen.getByText(/Max Musterfrau/i)).toBeInTheDocument();
    expect(screen.getAllByRole('dataRow')).toHaveLength(2);

    // check if modal has been closed
    await waitFor(() => expect(screen.queryByRole('modal')).not.toBeInTheDocument());
    expect(screen.queryByText(/Delete this transfer?/i)).not.toBeInTheDocument();

    // check if notification has been triggered
    await waitFor(() => expect(screen.getByRole('notification'))
      .toHaveTextContent(('Failed to delete transfer')));
  });
});
