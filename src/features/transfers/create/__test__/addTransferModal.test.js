import { screen, within, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { endOfTomorrow, format } from 'date-fns';
import Notification from '../../../../components/Notification';
import { configServer } from '../../../../testUtils/configServer';
import { TransfersListContainer } from '../../list/TransfersListContainer';
import { AddTransfer } from '../AddTransfer';

const component = <>
  <TransfersListContainer />
  <AddTransfer />
  <Notification />
</>

// We use msw to intercept the network request during the test,
// and return the response
const fakeServer = configServer(component);

const openModal = async () => {
    fireEvent.click(await screen.findByRole('button', {name: /Add transfer/i}));
};

const tomorrow = format(Date.parse(endOfTomorrow()), 'dd.MM.yyyy');

describe('Add transfer button', () => {
  it('should activate add transfer modal', async () => {
    // Act
    fireEvent.click(await screen.findByRole('button', {name: /Add transfer/i}));

    // Assert
    const modal = await screen.findByRole('modal');
    expect(within(modal).getByText(/Add new transfer/i));
    expect(within(modal).getByRole('button', {name: /Cancel/i}));
    expect(within(modal).getByRole('button', {name: /Save/i}));
  });
});

describe('Form submit button', () => {
  it('should show error message if IBAN is invalid', async () => {
    // Act
    await openModal();

    fireEvent.change(screen.getByLabelText(/IBAN/i), {target: {value: '123'}}); // invalid value
    fireEvent.change(screen.getByLabelText(/Amount/i), {target: {value: '100'}});
    fireEvent.change(screen.getByLabelText(/Date/i), {target: {value: tomorrow}});

    fireEvent.click(await screen.findByRole('button', {name: /Save/i}));

    // Assert
    expect(screen.queryByRole('form')).toHaveTextContent(('Invalid IBAN number'));
  });

  it('should show error message if amount is in invalid format', async () => {
    // Act
    await openModal();

    fireEvent.change(screen.getByLabelText(/IBAN/i), {target: {value: 'DE75512108001245126199'}});
    fireEvent.change(screen.getByLabelText(/Amount/i), {target: {value: '100,123'}}); // invalid value
    fireEvent.change(screen.getByLabelText(/Date/i), {target: {value: tomorrow}});

    fireEvent.click(await screen.findByRole('button', {name: /Save/i}));

    // Assert
    expect(await screen.findByRole('form')).toHaveTextContent(('Invalid amount format'));
  });

  it('should show error message if amount exceeds 20000000', async () => {
    // Act
    await openModal();

    fireEvent.change(screen.getByLabelText(/IBAN/i), {target: {value: 'DE75512108001245126199'}});
    fireEvent.change(screen.getByLabelText(/Amount/i), {target: {value: '100000000'}}); // invalid value
    fireEvent.change(screen.getByLabelText(/Date/i), {target: {value: tomorrow}});

    fireEvent.click(await screen.findByRole('button', {name: /Save/i}));

    // Assert
    expect(await screen.findByRole('form')).toHaveTextContent(('Amount value must be less than 20000000'));
  });

  it('should show error message if amount is less than 50', async () => {
    // Act
    await openModal();

    fireEvent.change(screen.getByLabelText(/IBAN/i), {target: {value: 'DE75512108001245126199'}});
    fireEvent.change(screen.getByLabelText(/Amount/i), {target: {value: '10'}}); // invalid value
    fireEvent.change(screen.getByLabelText(/Date/i), {target: {value: tomorrow}});

    fireEvent.click(await screen.findByRole('button', {name: /Save/i}));

    // Assert
    expect(await screen.findByRole('form')).toHaveTextContent(('Amount value must be larger than 50'));
  });


  it('should show error message if date is invalid', async () => {
    // Act
    await openModal();

    fireEvent.change(screen.getByLabelText(/IBAN/i), {target: {value: 'DE75512108001245126199'}});
    fireEvent.change(screen.getByLabelText(/Amount/i), {target: {value: '100'}});
    fireEvent.change(screen.getByLabelText(/Date/i), {target: {value: '2023-10-11'}}); // invalid value

    fireEvent.click(await screen.findByRole('button', {name: /Save/i}));

    // Assert
    expect(await screen.findByRole('form')).toHaveTextContent(('Invalid date, use german date format dd.mm.yyyy'));
  });

  it('should show error message if date is in the past', async () => {
    // Act
    await openModal();

    fireEvent.change(screen.getByLabelText(/IBAN/i), {target: {value: 'DE75512108001245126199'}});
    fireEvent.change(screen.getByLabelText(/Amount/i), {target: {value: '100'}});
    fireEvent.change(screen.getByLabelText(/Date/i), {target: {value: '11.10.2021'}}); // invalid value

    fireEvent.click(await screen.findByRole('button', {name: /Save/i}));

    // Assert
    expect(await screen.findByRole('form')).toHaveTextContent(('Date must be in the future'));
  });

  it('should add new transfer if validation passes', async () => {
    // Act
    await openModal();

    fireEvent.change(screen.getByLabelText(/Account holder/i), {target: {value: 'new user'}});
    fireEvent.change(screen.getByLabelText(/IBAN/i), {target: {value: 'DE75512108001245126199'}});
    fireEvent.change(screen.getByLabelText(/Amount/i), {target: {value: '100'}});
    fireEvent.change(screen.getByLabelText(/Date/i), {target: {value: tomorrow}});

    // Act
    fireEvent.click(await screen.findByRole('button', {name: /Save/i}));

    // Assert
    // check if modal has been closed
    await waitFor(() => expect(screen.queryByRole('modal')).not.toBeInTheDocument());
    expect(screen.queryByText(/Add new transfer/i)).not.toBeInTheDocument();

    // check if new transfer has been added
    await waitFor(() => expect(screen.getAllByRole('dataRow')).toHaveLength(3));
    expect(screen.queryByText('new user')).toBeInTheDocument();

    // check if notification has been triggered
    await waitFor(() => expect(screen.getByRole('notification'))
      .toHaveTextContent(('Transfer created')));
  });

  it('should handle error when post request failed', async () => {
    // Arrange
    // In this paticular test respond to the same request with a 404 response.
    fakeServer.use(
      rest.post(`${process.env.REACT_APP_API_BASE_URL}/transfer`, (req, res, ctx) => {
        return res(ctx.status(404))
      })
    )

    // Act
    await openModal();

    fireEvent.change(screen.getByLabelText(/IBAN/i), {target: {value: 'DE75512108001245126199'}});
    fireEvent.change(screen.getByLabelText(/Amount/i), {target: {value: '100'}});
    fireEvent.change(screen.getByLabelText(/Date/i), {target: {value: '11.10.2300'}});

    fireEvent.click(await screen.findByRole('button', {name: /Save/i}));

    // Assert
    // check if modal has been closed
    await waitFor(() => expect(screen.queryByRole('modal')).not.toBeInTheDocument());
    expect(screen.queryByText(/Add new transfer/i)).not.toBeInTheDocument();

    // check if notification has been triggered
    await waitFor(() => expect(screen.getByRole('notification'))
      .toHaveTextContent(('Failed to save transfer')));
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
    expect(screen.queryByText(/Add new transfer/i)).not.toBeInTheDocument();
  });
});
