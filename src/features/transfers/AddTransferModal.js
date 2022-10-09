import { useState } from 'react';
import { useAddNewTransferMutation } from './slices/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setAddModalVisibility } from './slices/transferStatusSlice';

export const AddTransferModal = () => {
  const [accountHolder, setAccountHolder] = useState('');
  const [iban, setIban] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  const dispatch = useDispatch();
  const isVisible = useSelector(state => state.transferStatus.isAddModalVisible);
  const [addNewTransfer] = useAddNewTransferMutation()

  const onAccountHolderChanged = e => setAccountHolder(e.target.value);
  const onIbanChanged = e => setIban(e.target.value);
  const onAmountChanged = e => setAmount(e.target.value);
  const onDateChanged = e => setDate(e.target.value);
  const onNoteChanged = e => setNote(e.target.value);

  const onAddButtonClicked = () => {
    dispatch(setAddModalVisibility(true));
  }

  const onCancelButtonClicked = () => {
    dispatch(setAddModalVisibility(false));
  }

  const onFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await addNewTransfer({
        accountHolder,
        iban,
        amount,
        date,
        note
      }).unwrap();

      dispatch(setAddModalVisibility(false));
      setAccountHolder('');
      setIban('');
      setAmount('');
      setDate('');
      setNote('');
    } catch (err) {
      console.error('Failed to save transfer: ', err);
    }
  }

  let content;

  if (isVisible) {
    content = (
      <form onSubmit={onFormSubmit} className={isVisible ? "" : "hidden"}>
        <h2>Add a new transfer</h2>
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

  return (
    <section>
      <button
        type="button"
        onClick={onAddButtonClicked}>
          Add new transfer
      </button>
      {content}
    </section>
  )
}