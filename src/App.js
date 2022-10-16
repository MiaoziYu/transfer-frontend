import React from 'react';
import { TransfersListContainer } from './features/transfers/list/TransfersListContainer';
import { AddTransfer } from './features/transfers/create/AddTransfer';
import { EditTransferContainer } from './features/transfers/edit/EditTransferContainer';
import { DeleteConfirmationModal } from './features/transfers/delete/DeleteConfirmationModal';
import { AddTransferButton } from './features/transfers/create/AddTransferButton';
import './App.css';

function App() {

  return (
    <React.Fragment>
      <TransfersListContainer />
      <AddTransfer />
      <EditTransferContainer />
      <DeleteConfirmationModal />
    </React.Fragment>
  );
}

export default App;
