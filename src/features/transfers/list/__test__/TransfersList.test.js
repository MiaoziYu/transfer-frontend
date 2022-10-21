import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { rest } from 'msw';
import { configServer } from '../../../../testUtils/configServer';
import { EditTransferContainer } from '../../edit/EditTransferContainer';
import { TransfersListContainer } from '../TransfersListContainer';

const component = <>
  <TransfersListContainer />
  <EditTransferContainer />
</>

// We use msw to intercept the network request during the test,
// and return the response
const fakeServer = configServer(component);

describe('TransferList', () => {
  it('should fetch and render transfers', async () => {
    // Assert
    expect(await screen.findByText(/Max Mustermann/i)).toBeInTheDocument()
    expect(screen.getByText(/Max Musterfrau/i)).toBeInTheDocument()

    const dataRow = await screen.findAllByRole('dataRow');
    expect(dataRow).toHaveLength(2);

    // check if IBAN is displayed in correct format
    expect(within(dataRow[0]).getByText('DE75 5121 0800 1245 1261 99'));

    // check if amout is displayed in correct format
    await waitFor(() => expect(within(dataRow[0]).queryByText('100,00 €')));

    // check if date is displayed in correct format
    expect(within(dataRow[0]).getByText('02.11.2022'));

    // check if note excerpt is displayed in correct format
    expect(within(dataRow[0]).getByText('this is note for the...'));
  });

  it('should handle error when api request failed', async () => {
    // Arrange
    // In this paticular test respond to the same request with a 404 response.
    fakeServer.use(
      rest.get(`${process.env.REACT_APP_API_BASE_URL}/transfer`, (req, res, ctx) => {
        return res(ctx.status(404))
      })
    )

    // Act
    // transfers list will be refetched after updating a transfer
    // we use this behavior to trigger api error
    fireEvent.click((await screen.findAllByRole('editButton'))[0]);
    fireEvent.click(await screen.findByRole('button', {name: /Save/i}));

    // Assert
    await waitFor(() => expect(screen.queryByText(/Cannot fetch transfers from server/i)));
  });

  describe('Search Input', () => {
    it('should filter transfer list by account holder', async () => {
      // Act
      const searchInput = await screen.findByRole('textbox');
      fireEvent.change(searchInput, {target: {value: 'frau'}})

      // Assert
      await waitFor(() => expect(screen.queryByText(/Max Mustermann/i)).not.toBeInTheDocument());
      expect(screen.getByText(/Max Musterfrau/i)).toBeInTheDocument();
    });

    it('should filter transfer list by note', async () => {
      // Act
      const searchInput = await screen.findByRole('textbox');
      fireEvent.change(searchInput, {target: {value: 'first'}})

      // Assert
      await waitFor(() => expect(screen.queryByText(/Max Musterfrau/i)).not.toBeInTheDocument());
      expect(screen.getByText(/Max Mustermann/i)).toBeInTheDocument();
    });

    it('should show all transfers when search input is cleared', async () => {
      // Act
      const searchInput = await screen.findByRole('textbox');
      fireEvent.change(searchInput, {target: {value: 'frau'}})

      // Assert
      await waitFor(() => expect(screen.queryByText(/Max Mustermann/i)).not.toBeInTheDocument());
      expect(screen.getByText(/Max Musterfrau/i)).toBeInTheDocument();

      // Act
      // empty the input
      fireEvent.change(searchInput, {target: {value: ''}})

      // Assert
      await waitFor(() => expect(screen.getByText(/Max Musterfrau/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByText(/Max Mustermann/i)).toBeInTheDocument());
    });
  });

  describe('Sort buttons', () => {
    it('should sort transfers by amount', async () => {
      // Act
      const sortButton = await screen.findByRole('columnheader', {name: /Amount/i});
      fireEvent.click(sortButton)

      // Assert
      let transfers = await screen.findAllByRole('dataRow');
      expect(transfers[0]).toHaveTextContent(/Musterfrau/i);
      expect(transfers[1]).toHaveTextContent(/MusterMann/i);

      // click again to sort in ascending order
      fireEvent.click(sortButton)

      // Assert
      transfers = await screen.findAllByRole('dataRow');
      expect(transfers[0]).toHaveTextContent(/MusterMann/i);
      expect(transfers[1]).toHaveTextContent(/Musterfrau/i);
    });

    it('should sort transfers by date', async () => {
      // Act
      const sortButton = await screen.findByRole('columnheader', {name: /Date/i});
      fireEvent.click(sortButton)

      // Assert
      let transfers = await screen.findAllByRole('dataRow');
      expect(transfers[0]).toHaveTextContent(/MusterMann/i);
      expect(transfers[1]).toHaveTextContent(/Musterfrau/i);

      // click again to sort in ascending order
      fireEvent.click(sortButton)

      // Assert
      transfers = await screen.findAllByRole('dataRow');
      expect(transfers[0]).toHaveTextContent(/Musterfrau/i);
      expect(transfers[1]).toHaveTextContent(/MusterMann/i);
    });
  });
});