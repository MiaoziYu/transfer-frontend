import { useDispatch, useSelector } from 'react-redux';
import { useDeleteTransferMutation } from '../slices/apiSlice'
import { setDeleteTargetId } from '../slices/statusSlice'

export const DeleteConfirmationModal = () => {
  const transferId = useSelector(state => state.transferStatus.deleteTargetId);
  const deleteTargetId = useSelector(state => state.transferStatus.deleteTargetId);
  const dispatch = useDispatch();
  const [deleteTransfer] = useDeleteTransferMutation()

  const onCancelButtonClicked = () => {
    dispatch(setDeleteTargetId(undefined));
  };

  const onDeleteButtonClicked = async () => {
    try {
      await deleteTransfer(transferId);
      dispatch(setDeleteTargetId(undefined));
    } catch (err) {
      console.error('Failed to delete transfer: ', err);
    }
  };

  return (
    <>
      {deleteTargetId && <section className="card">
        <h2>Are you sure you want to delete this transfer</h2>
        <button type="button" onClick={onCancelButtonClicked}>Cancel</button>
        <button type="button" onClick={onDeleteButtonClicked}>Delete</button>
      </section>}
    </>
  )
}