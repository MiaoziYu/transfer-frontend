import { useState } from 'react';
import { isValid, isPast } from 'date-fns';
import IBAN from 'iban';
import Input from '../../../components/Input';
import Textarea from '../../../components/Textarea';
import { errorMessages } from '../../../utils/errorMessages';
import formatter from '../../../utils/formatter';

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
      errors.iban = errorMessages.invalidIban;
    }

    let stringAmount = String(amount);
    if (!(stringAmount).match(/^\d{1,3}(?:\.?\d{3})*(?:,\d{1,2})?$/)) {
      errors.amount = errorMessages.invalidAmount;
    } else {
      let numberAmount = Number(stringAmount.replaceAll('.', '').replace(',', '.'));
      if (numberAmount > 20000000) {
        errors.amount = errorMessages.amountValueTooLarge;
      } else if (numberAmount < 50) {
        errors.amount = errorMessages.amountValueTooSmall;
      }
    }

    const parsedDate = formatter.parseGermanDate(date);
    if (!isValid(parsedDate)) {
      errors.date = errorMessages.invalidDate;
    } else if (isPast(parsedDate)) {
      errors.date = errorMessages.dateIsPast;
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
    <>
    <form role="form">
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
        placeholder="50 - 20.000.000 max 2 decimals"
        required
        error={formErrors.amount}
      />
      <label htmlFor="date">Date</label>
      <Input
        id="date"
        name="date"
        value={date}
        onChange={onDateChanged}
        placeholder="dd.mm.yyyy"
        required
        error={formErrors.date}
      />
      <label htmlFor="note">Note</label>
      <Textarea
        id="note"
        name="note"
        value={note}
        onChange={onNoteChanged}
        error={formErrors.note}
      />
    </form>
    <div className="modal__footer">
      <button
        type="button"
        onClick={onCancelButtonClicked}
        className="btn-grey">
        Cancel
      </button>
      <button
        type="submit"
        onClick={onFormSubmit}
        className="btn-green">
        Save
      </button>
    </div>
  </>
  )
}