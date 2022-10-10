import { useState } from 'react';
import { useDispatch } from 'react-redux'
import { useEditTransferMutation } from './slices/apiSlice'
import { setEditTargetId } from './slices/transferStatusSlice'
import { TransferForm } from './TransferForm';

export const EditTransferForm = (props) => {
  const { transfer } = props;
  const [accountHolder, setAccountHolder] = useState(transfer.accountHolder);
  const [iban, setIban] = useState(transfer.iban);
  const [amount, setAmount] = useState(transfer.amount);
  const [date, setDate] = useState(transfer.date);
  const [note, setNote] = useState(transfer.note);

  const dispatch = useDispatch();
  const [updateTransfer] = useEditTransferMutation()

  const onAccountHolderChanged = e => setAccountHolder(e.target.value);
  const onIbanChanged = e => setIban(e.target.value);
  const onAmountChanged = e => setAmount(e.target.value);
  const onDateChanged = e => setDate(e.target.value);
  const onNoteChanged = e => setNote(e.target.value);

  const onCancelButtonClicked = () => {
    dispatch(setEditTargetId(undefined));
  }

  const onFormSubmit = async (e) => {
    try {
      await updateTransfer({
        id: transfer.id,
        accountHolder,
        iban,
        amount,
        date,
        note
      }).unwrap();

      dispatch(setEditTargetId(undefined));
      setAccountHolder('')
      setIban('')
      setAmount('')
      setDate('')
      setNote('')
    } catch (err) {
      console.error('Failed to update the transfer: ', err)
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
      onFormSubmit={onFormSubmit}
      onCancelButtonClicked={onCancelButtonClicked}
    />
  )
}