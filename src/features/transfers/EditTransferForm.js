import { useState } from 'react';
import { useDispatch } from 'react-redux'
import { useEditTransferMutation } from './slices/apiSlice'
import { setEditTargetId } from './slices/transferStatusSlice'

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
    e.preventDefault()

    try {
      await updateTransfer({
        id: transfer.id,
        accountHolder,
        iban,
        amount,
        date,
        note
      })

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
    <form onSubmit={onFormSubmit}>
      <label htmlFor="accountHolder">Account holder</label>
      <input
        type="text"
        id="accountHolder"
        name="accountHolder"
        value={accountHolder}
        onChange={onAccountHolderChanged}
      />
      <label htmlFor="iban">IBAN</label>
      <input
        type="text"
        id="iban"
        name="iban"
        value={iban}
        onChange={onIbanChanged}
      />
      <label htmlFor="amount">Amount</label>
      <input
        type="text"
        id="amount"
        name="amount"
        value={amount}
        onChange={onAmountChanged}
      />
      <label htmlFor="accountHolder">Date</label>
      <input
        type="text"
        id="date"
        name="date"
        value={date}
        onChange={onDateChanged}
      />
      <label htmlFor="iban">Note</label>
      <textarea
        id="note"
        name="note"
        value={note}
        onChange={onNoteChanged}
      />
      <button type="button" onClick={onCancelButtonClicked}>Cancel</button>
      <button type="submit">Save transfer</button>
    </form>
  )
}