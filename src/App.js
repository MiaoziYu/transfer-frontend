import React from 'react';
import { useSelector } from 'react-redux';
import { TransfersList } from './features/transfers/TransfersList';
import { AddTransferModal } from './features/transfers/AddTransferModal';
import { EditTransferModal } from './features/transfers/EditTransferModal';
import { DeleteConfirmationModal } from './features/transfers/DeleteConfirmationModal';
import './App.css';

function App() {
  const editTargetId = useSelector(state => state.transferStatus.editTargetId);
  const deleteTargetId = useSelector(state => state.transferStatus.deleteTargetId);

  return (
    <div className="App">
      <React.Fragment>
        <TransfersList />
        <AddTransferModal />
        {editTargetId && (<EditTransferModal />)}
        {deleteTargetId && (<DeleteConfirmationModal />)}
      </React.Fragment>
    </div>
  );
}

export default App;
