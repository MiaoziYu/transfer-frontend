import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { format, formatISO } from 'date-fns';
import { useEditTransferMutation } from '../slices/apiSlice'
import { setEditTargetId, setNotification } from '../slices/statusSlice'
import { TransferForm } from '../partials/TransferForm';
import { parseGermanDate, togglePageScrolling } from '../../../helpers';

export const EditTransfer = (props) => {
  const { transfer } = props;
  const [accountHolder, setAccountHolder] = useState(transfer.accountHolder);
  const [iban, setIban] = useState(transfer.iban);
  const [amount, setAmount] = useState(transfer.amount);
  const [date, setDate] = useState(format(Date.parse(transfer.date), 'dd.MM.yyyy'));
  const [note, setNote] = useState(transfer.note);

  const dispatch = useDispatch();
  const [updateTransfer] = useEditTransferMutation()

  const onAccountHolderChanged = e => setAccountHolder(e.target.value);
  const onIbanChanged = e => setIban(e.target.value);
  const onAmountChanged = e => setAmount(e.target.value);
  const onDateChanged = e => setDate(e.target.value);
  const onNoteChanged = e => setNote(e.target.value);

  const closeModal = () => {
    dispatch(setEditTargetId(undefined));
    togglePageScrolling();
  }

  const onFormSubmit = async (e) => {
    try {
      // send put request to api
      await updateTransfer({
        id: transfer.id,
        accountHolder,
        iban,
        amount,
        date: formatISO(parseGermanDate(date)),
        note
      }).unwrap();

      closeModal();

      // trigger success notification
      dispatch(setNotification({
        status: 'success',
        message: 'Transfer updated'
      }));
    } catch (error) {
      closeModal();

      // trigger error notification
      dispatch(setNotification({
        status: 'error',
        message: 'Failed to update transfer'
      }));
    }
  }

  return (
    <TransferForm
      accountHolder={accountHolder}
      iban={iban}
      amount={amount}
      date={date}
      note={note}
      onAccountHolderChanged={onAccountHolderChanged}
      onIbanChanged={onIbanChanged}
      onAmountChanged={onAmountChanged}
      onDateChanged={onDateChanged}
      onNoteChanged={onNoteChanged}
      formAction={onFormSubmit}
      onCancelButtonClicked={closeModal} />
  )}