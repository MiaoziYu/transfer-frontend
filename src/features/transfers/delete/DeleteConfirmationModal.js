import { useDispatch, useSelector } from 'react-redux';
import { toogleBackground } from '../../../helpers';
import { useDeleteTransferMutation } from '../slices/apiSlice'
import { setDeleteTargetId, setNotification } from '../slices/statusSlice'

export const DeleteConfirmationModal = () => {
  const transferId = useSelector(state => state.transferStatus.deleteTargetId);
  const deleteTargetId = useSelector(state => state.transferStatus.deleteTargetId);
  const dispatch = useDispatch();
  const [deleteTransfer] = useDeleteTransferMutation()

  const closeModal = () => {
    dispatch(setDeleteTargetId(undefined));
    toogleBackground();
  }

  const onDeleteButtonClicked = async () => {
    try {
      const res = await deleteTransfer(transferId).unwrap();
      closeModal();
      dispatch(setNotification({
        status: 'success',
        message: 'Transfer deleted'
      }));
    } catch (error) {
      console.log('error')
      closeModal();
      dispatch(setNotification({
        status: 'error',
        message: 'Failed to delete transfer'
      }));
    }
  };

  return (
    <>
      {deleteTargetId && <section className="modal" role="modal">
        <div className="modal__dialog card">
          <div className="modal__header">
            <h2>Delete this transfer?</h2>
          </div>
          <div className="modal__footer">
            <button type="button"
              onClick={closeModal}
              className="btn-grey"
              role="cancelDelete">
              Cancel
            </button>
            <button
              type="button"
              onClick={onDeleteButtonClicked}
              className="btn-red"
              role="confirmDelete">
              Delete
            </button>
          </div>
        </div>
      </section>}
    </>
  )
}