import { fireEvent, screen, within, waitFor } from '@testing-library/react'
import { configServer } from '../../../../testUtils/configServer';
import { rest } from 'msw';
import { TransfersListContainer } from '../../list/TransfersListContainer';
import { EditTransferContainer } from '../EditTransferContainer';
import Notification from '../../../../components/Notification';

const component = <>
  <TransfersListContainer />
  <EditTransferContainer />
  <Notification />
</>

// We use msw to intercept the network request during the test,
// and return the response
const fakeServer = configServer(component);

const openModal = async () => {
  const modalButton = (await screen.findAllByRole('editButton'))[0];
  fireEvent.click(modalButton);
}

describe('Edit transfer button', () => {
  it('should activate edit transfer modal', async () => {
    // Act
    await openModal();

    // Assert
    const modal = await screen.findByRole('modal');
    expect(within(modal).getByText(/Edit transfer/i));
    expect(await within(modal).findByRole('button', {name: /Cancel/i}));
    expect(within(modal).getByRole('button', {name: /Save/i}));

    // check if form data is filled
    expect(screen.getByLabelText(/Account holder/i).value).toBe('Max Mustermann');
    expect(screen.getByLabelText(/IBAN/i).value).toBe('DE75 5121 0800 1245 1261 99');
    expect(screen.getByLabelText(/Amount/i).value).toBe('1.000');
    expect(screen.getByLabelText(/Date/i).value).toBe('02.11.2022');
    expect(screen.getByLabelText(/Note/i).value).toBe('this is note for the first transfer');
  });

  it('should handle error when get transfer request failed', async () => {
    // Arrange
    // In this paticular test respond to the same request with a 404 response.
    fakeServer.use(
      rest.get(`${process.env.REACT_APP_API_BASE_URL}/transfer/:transferId`, (req, res, ctx) => {
        return res(ctx.status(404))
      })
    )

    // Act
    fireEvent.click((await screen.findAllByRole('editButton'))[0]);

    // Assert
    const modal = await screen.findByRole('modal');
    expect(within(modal).getByText(/Edit transfer/i));
    expect(await within(modal).findByText(/Cannot get transfer date/i));
  });
});

describe('Form submit button', () => {
  it('should update transfer if validation passes', async () => {
    // Act
    await openModal();

    fireEvent.change(await screen.findByLabelText(/Account holder/i), {target: {value: 'new name'}});
    fireEvent.change(await screen.findByLabelText(/Amount/i), {target: {value: '3.000,00'}});
    fireEvent.click(await screen.findByRole('button', {name: /Save/i}));

    // Assert
    // check if modal has been closed
    await waitFor(() => expect(screen.queryByRole('modal')).not.toBeInTheDocument());
    expect(screen.queryByText(/Edit transfer/i)).not.toBeInTheDocument();

    // check if transfer has been updated
    await waitFor(() => expect(screen.getByText('new name')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('3.000,00 €')).toBeInTheDocument());

    // check if notification has been triggered
    await waitFor(() => expect(screen.getByRole('notification'))
      .toHaveTextContent(('Transfer updated')));
  });

  it('should handle error when request failed', async () => {
    // Arrange
    // In this paticular test respond to the same request with a 404 response.
    fakeServer.use(
      rest.put(`${process.env.REACT_APP_API_BASE_URL}/transfer/:transferId`, (req, res, ctx) => {
        return res(ctx.status(404))
      })
    )

    // Act
    await openModal();

    fireEvent.click(await screen.findByRole('button', {name: /Save/i}));

    // Assert
    // check if modal has been closed
    await waitFor(() => expect(screen.queryByRole('modal')).not.toBeInTheDocument());
      expect(screen.queryByText(/Add new transfer/i)).not.toBeInTheDocument();

    // check if notification has been triggered
    await waitFor(() => expect(screen.getByRole('notification'))
      .toHaveTextContent(('Failed to update transfer')));
  });
});

describe('Form cancel button', () => {
  it('should close the modal', async () => {
    // Act
    await openModal();

    const cancelButton = await screen.findByRole('button', {name: /Cancel/i});
    fireEvent.click(cancelButton);

    // Assert
    expect(screen.queryByRole('modal')).not.toBeInTheDocument();
    expect(screen.queryByText(/Edit transfer/i)).not.toBeInTheDocument();
  });
});
