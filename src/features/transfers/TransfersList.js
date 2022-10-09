import { useDispatch } from 'react-redux'
import { format } from 'date-fns';
import { useGetTransfersQuery } from './slices/apiSlice'
import {
  setEditTargetId,
  setDeleteTargetId,
} from './slices/transferStatusSlice'

export const TransfersList = (props) => {
  const {
    data: transfers,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetTransfersQuery()

  const dispatch = useDispatch();

  const onEditButtonClicked = (transferId) => {
    dispatch(setEditTargetId(transferId));
  }

  const onDeleteButtonClicked = (transferId) => {
    dispatch(setDeleteTargetId(transferId));
  }

  let content;

  if (isLoading) {
    content = <div>is loading</div>
  } else if (isSuccess) {
    const renderedTransfers = transfers.map(transfer => (
      <tr key={transfer.id}>
        <td>{transfer.accountHolder}</td>
        <td>{transfer.iban}</td>
        <td>{transfer.amount}</td>
        <td>
          {Date.parse(transfer.date) ? format(Date.parse(transfer.date), 'dd.MM.yyyy') : ''}
          </td>
        <td>{transfer.note.substring(0, 50)}</td>
        <td>
          <button
            type="button"
            onClick={() => onEditButtonClicked(transfer.id)}>
              edit
          </button>
          <button
            type="button"
            onClick={() => onDeleteButtonClicked(transfer.id)}>delete</button>
        </td>
      </tr>
    ))

    content = (
      <table>
        <thead>
          <tr>
            <th>Account holder</th>
            <th>IBAN</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Note</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {renderedTransfers}
        </tbody>
      </table>
    );
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }

  return (
    <section>
      <h2>Transfers</h2>
      {content}
    </section>
  )
}