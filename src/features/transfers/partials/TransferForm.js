import { useState } from 'react';
import { isValid, parse, isPast } from 'date-fns';
import IBAN from 'iban';
import Input from '../../../components/Input';
import Textarea from '../../../components/Textarea';
import { parseGermanDate } from '../../../helpers';

export const TransferForm = (props) => {
  const {
    accountHolder,
    iban,
    amount,
    date,
    note,
    onAccountHolderChanged,
    onIbanChanged,
    onAmountChanged,
    onDateChanged,
    onNoteChanged,
    formAction,
    onCancelButtonClicked
  } = props;

  const [formErrors, setFormErrors] = useState({});

  const validateForm = ({iban, amount, date}) => {
    const errors = {};

    if (!IBAN.isValid(iban)) {
      errors.iban = 'Invalid IBAN number';
    }

    if (!amount.match(/^\d{1,3}(?:\.?\d{3})*(?:,\d{1,2})?$/)) {
      errors.amount = 'Invalid amount format';
    }

    const parsedDate = parseGermanDate(date);
    if (!isValid(parsedDate)) {
      errors.date = 'Invalid date, use German date format dd.mm.yyyy';
    } else if (isPast(parsedDate)) {
      errors.date = 'Date must be in the future';
    }

    return errors;
  }

  const isFormValid = () => {
    const errors = validateForm({iban, amount, date});

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  }

  const onFormSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) return;

    formAction();
  }

  return (
    <form onSubmit={onFormSubmit}>
      <label htmlFor="accountHolder">Account holder</label>
      <Input
        id="accountHolder"
        name="accountHolder"
        value={accountHolder}
        onChange={onAccountHolderChanged}
        error={formErrors.accountHolder}
      />
      <label htmlFor="iban">IBAN</label>
      <Input
        id="iban"
        name="iban"
        value={iban}
        onChange={onIbanChanged}
        required
        error={formErrors.iban}
      />
      <label htmlFor="amount">Amount</label>
      <Input
        id="amount"
        name="amount"
        value={amount}
        onChange={onAmountChanged}
        required
        error={formErrors.amount}
      />
      <label htmlFor="accountHolder">Date</label>
      <Input
        id="date"
        name="date"
        value={date}
        onChange={onDateChanged}
        placeholder="dd.mm.yyyy"
        required
        error={formErrors.date}
      />
      <label htmlFor="iban">Note</label>
      <Textarea
        id="note"
        name="note"
        value={note}
        onChange={onNoteChanged}
        error={formErrors.note}
      />
      <button type="button" onClick={onCancelButtonClicked}>Cancel</button>
      <button type="submit">Save transfer</button>
    </form>
  )
}