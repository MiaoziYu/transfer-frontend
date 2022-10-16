import React from 'react';
import { TransfersListContainer } from './features/transfers/list/TransfersListContainer';
import { AddTransfer } from './features/transfers/create/AddTransfer';
import { EditTransferContainer } from './features/transfers/edit/EditTransferContainer';
import { DeleteConfirmationModal } from './features/transfers/delete/DeleteConfirmationModal';
import Notification from './components/Notification';
import './App.css';

function App() {

  return (
    <React.Fragment>
      <TransfersListContainer />
      <AddTransfer />
      <EditTransferContainer />
      <DeleteConfirmationModal />
      <Notification />
    </React.Fragment>
  );
}

export default App;
