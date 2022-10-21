import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  setEditTargetId,
  setDeleteTargetId,
} from '../slices/statusSlice';
import { svg } from '../../../utils/svg';
import { SearchInput } from './SearchInput';
import { AddTransferButton } from '../create/AddTransferButton';
import { togglePageScrolling } from '../../../utils/helpers';
import formatter from '../../../utils/formatter';

export const TransfersList = (props) => {
  const [sortKey, setSortKey] = useState(undefined);
  const [isSortAscending, setIsSortAscending] = useState(false);
  const [filterKeyword, setFilterKeyword] = useState('');

  const dispatch = useDispatch();

  const onEditButtonClicked = (transferId) => {
    // save transfer id to state, to be used in edit modal
    // editTargetId !== undefined will activate modal
    dispatch(setEditTargetId(transferId));

    // prevent page from scrolling when modal is active
    togglePageScrolling();
  }

  const onDeleteButtonClicked = (transferId) => {
    // save transfer id to state, to be used in delete modal
    // deleteTargetId !== undefined will activate modal
    dispatch(setDeleteTargetId(transferId));

    // prevent page from scrolling when modal is active
    togglePageScrolling();
  }

  /**
   * @param key sort key from click event
   */
  const setSortConfig = (key) => {
    if (key === sortKey) {
      setIsSortAscending(!isSortAscending);
    } else {
      setIsSortAscending(false);
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

  const renderedTransfers = preparedTransfers.map((transfer) => (
    <tr key={transfer.id} role="dataRow">
      <td className="table__account-holder monospaced-font">{transfer.accountHolder}</td>
      <td className="table__iban">{formatter.formatIban(transfer.iban)}</td>
      <td className="text-right monospaced-font">{formatter.formatAmount(transfer.amount, true)}</td>
      <td>{formatter.formatDate(transfer.date)}</td>
      <td>{formatter.formatAsExcerpt(transfer.note)}</td>
      <td className="table__actions">
        <button
          type="button"
          onClick={() => onEditButtonClicked(transfer.id)}
          className="table__edit-btn"
          role="editButton">
            {svg.edit}
        </button>
        <button
          type="button"
          onClick={() => onDeleteButtonClicked(transfer.id)}
          className="table__edit-btn"
          role="deleteButton">
          {svg.delete}
        </button>
      </td>
    </tr>
  ))

  return (
    <>
      <div className="search-input-wrapper">
        <SearchInput onChange={setFilterKeyword} />
        <AddTransferButton />
      </div>
      <table>
        <thead>
          <tr>
            <th>Account holder</th>
            <th>IBAN</th>
            <th
              onClick={() => setSortConfig('amount')}
              className="table__sort-btn text-right">
                <span>Amount</span>
                {getSortSvg('amount')}
              </th>
            <th
              onClick={() => setSortConfig('date')}
              className="table__sort-btn">
              <span>Date</span>
              {getSortSvg('date')}
            </th>
            <th>Note</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {renderedTransfers}
        </tbody>
    </table>
  </>
  )
}