import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { format } from 'date-fns';
import {
  setEditTargetId,
  setDeleteTargetId,
} from './slices/transferStatusSlice';
import { debounce } from '../../helpers';

export const TransfersTable = (props) => {
  const { transfers } = props;
  const [preparedTransfers, setPrepareedTransfers] = useState(transfers);
  const [sortKey, setSortKey] = useState('');
  const [isSortAscending, setIsSortAscending] = useState(true);

  const dispatch = useDispatch();

  const onEditButtonClicked = (transferId) => {
    dispatch(setEditTargetId(transferId));
  }

  const onDeleteButtonClicked = (transferId) => {
    dispatch(setDeleteTargetId(transferId));
  }

  const handleSorting = (key) => {
    const transfersToSort = [...transfers];
    let isAscending = isSortAscending;

    if (key === sortKey) {
      isAscending = !isAscending;
      setIsSortAscending(!isSortAscending);
    }

    setSortKey(key);

    transfersToSort.sort((a, b) => {
      if (a[key] < b[key]) {
        return isAscending ? -1 : 1;
      }

      if (a[key] > b[key]) {
        return isAscending ? 1 : -1;
      }

      return 0;
    });

    setPrepareedTransfers(transfersToSort);
  }

  const handleFiltering = () => {
    return debounce((e) => {
      const searchKeyword = e.target.value;
      const transfersToFilter = [...transfers];
      const filteredTransfers = transfersToFilter.filter(({accountHolder, note}) => {
        return accountHolder.includes(searchKeyword) || note.includes(searchKeyword);
      });

      setPrepareedTransfers(filteredTransfers);
    })
  };

  const renderedTransfers = preparedTransfers.map(transfer => (
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

  return (
    <>
    <input
      type="text"
      onChange={handleFiltering()}
      placeholder="search for name or note">
    </input>
    <table>
      <thead>
        <tr>
          <th>Account holder</th>
          <th>IBAN</th>
          <th onClick={() => handleSorting('amount')}>Amount</th>
          <th onClick={() => handleSorting('date')}>Date</th>
          <th>Note</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {renderedTransfers}
      </tbody>
  </table>
  </>
  )
}