import { screen, within, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { endOfTomorrow, format } from 'date-fns';
import Notification from '../../../../components/Notification';
import { configServer } from '../../../../testUtils/configServer';
import { TransfersListContainer } from '../../list/TransfersListContainer';
import { AddTransfer } from '../AddTransfer';
import { errorMessages } from '../../../../utils/errorMessages';

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
    const invalidIban = [
      '',
      'DE7551210800124512619'
    ];

    // Act
    await openModal();

    for (const iban of invalidIban) {
      fireEvent.change(screen.getByLabelText(/IBAN/i), {target: {value: iban}}); // invalid value
      fireEvent.change(screen.getByLabelText(/Amount/i), {target: {value: '100'}});
      fireEvent.change(screen.getByLabelText(/Date/i), {target: {value: tomorrow}});

      fireEvent.click(await screen.findByRole('button', {name: /Save/i}));

      // Assert
      expect(screen.queryByRole('form')).toHaveTextContent((errorMessages.invalidIban));
    }
  });

  it('should pass validation when IBAN is valid', async () => {
    const validIban = [
      'DE75 5121 0800 1245 1261 99',
      'DE75 5121 0800 1245 126199',
      'DE75512108001245126199'
    ];

    // Act
    await openModal();

    for (const iban of validIban) {
      fireEvent.change(screen.getByLabelText(/IBAN/i), {target: {value: iban}}); // valid value
      fireEvent.change(screen.getByLabelText(/Amount/i), {target: 100});
      fireEvent.change(screen.getByLabelText(/Date/i), {target: {value: tomorrow}});

      fireEvent.click(await screen.findByRole('button', {name: /Save/i}));

      // Assert
      await waitFor(() => expect(screen.queryByRole('form')).not.toHaveTextContent((errorMessages.invalidIban)));
      expect
    }
  });

  it('should show error message if amount is in invalid format', async () => {
    const invalidAmounts = [
      '',
      'xyz',
      '100.00',
      '100,000',
      '100.00,00',
      '100.,00,00',
      '100.000,.00',
      '1,0.,0,,00',
      ',100.00,0',
      '100.00,0.',
      '100.xa,00',
      '-100',
      '--100',
    ];

    // Act
    await openModal();

    for (const amount of invalidAmounts) {
      fireEvent.change(screen.getByLabelText(/IBAN/i), {target: {value: 'DE75512108001245126199'}});
      fireEvent.change(screen.getByLabelText(/Amount/i), {target: {value: amount}}); // invalid value
      fireEvent.change(screen.getByLabelText(/Date/i), {target: {value: tomorrow}});

      fireEvent.click(await screen.findByRole('button', {name: /Save/i}));

      // Assert
      expect(await screen.findByRole('form')).toHaveTextContent((errorMessages.invalidAmount));
    }
  });

  it('should pass validation when amount is valid', async () => {
    const validAmount = [
      '100',
      '1000',
      '1.000',
      '1000.000',
      '1000.000.000',
      '1000.000.000,00',
      '1000000000,00',
    ]
    // Act
    await openModal();

    for (const amount of validAmount) {
      fireEvent.change(screen.getByLabelText(/IBAN/i), {target: {value: 'DE75512108001245126199'}});
      fireEvent.change(screen.getByLabelText(/Amount/i), {target: {value: amount}}); // valid value
      fireEvent.change(screen.getByLabelText(/Date/i), {target: {value: tomorrow}});

      fireEvent.click(await screen.findByRole('button', {name: /Save/i}));

      // Assert
      await waitFor(() => expect(screen.queryByRole('form')).not.toHaveTextContent((errorMessages.invalidAmount)));
    }
  });

  it('should show error message if amount exceeds 20000000', async () => {
    const invalidAmounts = [
      '100000000',
      '100000000,01',
      '100000000,00',
      '100.000.000',
      '100.000.000,00',
      '100.000000,00',
      '100000.000,00',
    ];

    // Act
    await openModal();

    for (const amount of invalidAmounts) {
      fireEvent.change(screen.getByLabelText(/IBAN/i), {target: {value: 'DE75512108001245126199'}});
      fireEvent.change(screen.getByLabelText(/Amount/i), {target: {value: amount}}); // invalid value
      fireEvent.change(screen.getByLabelText(/Date/i), {target: {value: tomorrow}});

      fireEvent.click(await screen.findByRole('button', {name: /Save/i}));

      // Assert
      expect(await screen.findByRole('form')).toHaveTextContent((errorMessages.amountValueTooLarge));
    }
  });

  it('should show error message if amount is less than 50', async () => {
    const invalidAmounts = [
      '1',
      '1,00',
      '0,00',
      '0,01',
    ];

    // Act
    await openModal();


    for (const amount of invalidAmounts) {
      fireEvent.change(screen.getByLabelText(/IBAN/i), {target: {value: 'DE75512108001245126199'}});
      fireEvent.change(screen.getByLabelText(/Amount/i), {target: {value: amount}}); // invalid value
      fireEvent.change(screen.getByLabelText(/Date/i), {target: {value: tomorrow}});

      fireEvent.click(await screen.findByRole('button', {name: /Save/i}));

      // Assert
      expect(await screen.findByRole('form')).toHaveTextContent((errorMessages.amountValueTooSmall));
    }
  });

  it('should show error message if date is invalid', async () => {
    const invalidDates = [
      '',
      '2030-10-21',
      '2030 10 21',
      '2030/10/21',
      '2030.10.21',
      '10.21.2030',
      '21-10-2030',
      '21/10/2030',
      '21 10 2030',
      null,
      undefined,
      'abc'
    ];

    // Act
    await openModal();

    for (const date of invalidDates) {
      fireEvent.change(screen.getByLabelText(/IBAN/i), {target: {value: 'DE75512108001245126199'}});
      fireEvent.change(screen.getByLabelText(/Amount/i), {target: {value: '100'}});
      fireEvent.change(screen.getByLabelText(/Date/i), {target: {value: date}}); // invalid value

      fireEvent.click(await screen.findByRole('button', {name: /Save/i}));

      // Assert
      expect(await screen.findByRole('form')).toHaveTextContent((errorMessages.invalidDate));
    }
  });

  it('should show error message if date is in the past', async () => {
    // Act
    await openModal();

    fireEvent.change(screen.getByLabelText(/IBAN/i), {target: {value: ''}});
    fireEvent.change(screen.getByLabelText(/Amount/i), {target: {value: '100'}});
    fireEvent.change(screen.getByLabelText(/Date/i), {target: {value: '11.10.2021'}}); // invalid value

    fireEvent.click(await screen.findByRole('button', {name: /Save/i}));

    // Assert
    expect(await screen.findByRole('form')).toHaveTextContent((errorMessages.dateIsPast));
  });

  it('should add new transfer if all validations pass', async () => {
    // Act
    await openModal();

    fireEvent.change(screen.getByLabelText(/Account holder/i), {target: {value: 'new user'}});
    fireEvent.change(screen.getByLabelText(/IBAN/i), {target: {value: 'DE75 5121 0800 1245 1261 99'}});
    fireEvent.change(screen.getByLabelText(/Amount/i), {target: {value: '100'}});
    fireEvent.change(screen.getByLabelText(/Date/i), {target: {value: tomorrow}});

    // Act
    fireEvent.click(await screen.findByRole('button', {name: /Save/i}));

    // Assert
    // check if there is any error message
    for (const [key, errorMessage] of Object.entries(errorMessages)) {
      await waitFor(() => expect(screen.queryByRole('form')).not.toHaveTextContent(errorMessage));
    }

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
