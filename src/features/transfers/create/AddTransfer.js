import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatISO } from 'date-fns';
import { useAddNewTransferMutation } from '../slices/apiSlice';
import { setAddModalVisibility } from '../slices/statusSlice';
import { TransferForm } from '../partials/TransferForm';
import { parseGermanDate } from '../../../helpers';

export const AddTransfer = () => {
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

  const onCancelButtonClicked = () => {
    dispatch(setAddModalVisibility(false));
  }

  const onFormSubmit = async (e) => {
    try {
      await addNewTransfer({
        accountHolder,
        iban,
        amount,
        date: formatISO(parseGermanDate(date)),
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

  return (
    <>
      {isVisible && <section className="card">
        <h2>Add new transfer</h2>
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
          onCancelButtonClicked={onCancelButtonClicked}
        />
    </section>}
    </>
  )
}