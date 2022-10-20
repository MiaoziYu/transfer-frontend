import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatISO } from 'date-fns';
import { useAddNewTransferMutation } from '../slices/apiSlice';
import { setAddModalVisibility, setNotification } from '../slices/statusSlice';
import { TransferForm } from '../partials/TransferForm';
import { parseGermanDate, togglePageScrolling } from '../../../utils/helpers';

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

  const closeModal = () => {
    setAccountHolder('');
    setIban('');
    setAmount('');
    setDate('');
    setNote('');
    dispatch(setAddModalVisibility(false));
    togglePageScrolling();
  };

  const onFormSubmit = async (e) => {
    try {
      // send post request to api
      await addNewTransfer({
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
        message: 'Transfer created'
      }));
    } catch (error) {
      closeModal();

      // trigger error notification
      dispatch(setNotification({
        status: 'error',
        message: 'Failed to save transfer'
      }));
    }
  }

  return (
    <>
      {isVisible && <section className="modal" role="modal">
        <div className="modal__dialog card">
          <div className="modal__header">
            <h2>Add new transfer</h2>
          </div>
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
            onCancelButtonClicked={closeModal}
          />
        </div>
    </section>}
    </>
  )
}