import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import {
  setEditTargetId,
  setDeleteTargetId,
} from './slices/transferStatusSlice';
import { debounce } from '../../helpers';
import { svg } from '../../svg';

export const TransfersTable = (props) => {
  const [sortKey, setSortKey] = useState(undefined);
  const [isSortAscending, setIsSortAscending] = useState(true);
  const [filterKeyword, setFilterKeyword] = useState('');

  const dispatch = useDispatch();

  const onEditButtonClicked = (transferId) => {
    dispatch(setEditTargetId(transferId));
  }

  const onDeleteButtonClicked = (transferId) => {
    dispatch(setDeleteTargetId(transferId));
  }

  const setFilterConfig = () => {
    return debounce((e) => {
      setFilterKeyword(e.target.value)
    })
  }

  const setSortConfig = (key) => {
    if (key === sortKey) {
      setIsSortAscending(!isSortAscending);
    }
    setSortKey(key);
  }

  const sortTransfers = (draftTransfers) => {
    return draftTransfers.sort((a, b) => {
      if (a[sortKey] < b[sortKey]) {
        return isSortAscending ? -1 : 1;
      }

      if (a[sortKey] > b[sortKey]) {
        return isSortAscending ? 1 : -1;
      }

      return 0;
    });
  };

  const filterTransfers = (draftTransfers) => {
    return draftTransfers.filter(({accountHolder, note}) => {
      const lowered = filterKeyword.toLowerCase();
      return [accountHolder, note].some((one) => (one.toLowerCase().includes(lowered)))
    });
  };

  const getSortSvg = (key) => {
    if (!sortKey || sortKey !== key) return svg.sort;

    if (sortKey === key) {
      if (isSortAscending) {
        return svg.asc;
      } else {
        return svg.desc;
      }
    }
  };

  let preparedTransfers = filterTransfers(sortTransfers([...props.transfers]));

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
      onChange={setFilterConfig()}
      placeholder="search for name or note">
    </input>
    <table>
      <thead>
        <tr>
          <th>Account holder</th>
          <th>IBAN</th>
          <th onClick={() => setSortConfig('amount')}>Amount {getSortSvg('amount')}</th>
          <th onClick={() => setSortConfig('date')}>Date {getSortSvg('date')}</th>
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