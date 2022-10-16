import { useDispatch, useSelector } from 'react-redux';
import { toogleBackground } from '../../../helpers';
import { useDeleteTransferMutation } from '../slices/apiSlice'
import { setDeleteTargetId } from '../slices/statusSlice'

export const DeleteConfirmationModal = () => {
  const transferId = useSelector(state => state.transferStatus.deleteTargetId);
  const deleteTargetId = useSelector(state => state.transferStatus.deleteTargetId);
  const dispatch = useDispatch();
  const [deleteTransfer] = useDeleteTransferMutation()

  const onCancelButtonClicked = () => {
    dispatch(setDeleteTargetId(undefined));
    toogleBackground();
  };

  const onDeleteButtonClicked = async () => {
    try {
      await deleteTransfer(transferId);
      dispatch(setDeleteTargetId(undefined));
      toogleBackground();
    } catch (err) {
      console.error('Failed to delete transfer: ', err);
    }
  };

  return (
    <>
      {deleteTargetId && <section className="modal">
        <div className="modal__dialog card">
          <div className="modal__header">
            <h2>Delete this transfer?</h2>
          </div>
          <div className="modal__footer">
            <button type="button"
              onClick={onCancelButtonClicked}
              className="btn-grey">
              Cancel
            </button>
            <button
              type="button"
              onClick={onDeleteButtonClicked}
              className="btn-red">
              Delete
            </button>
          </div>
        </div>

      </section>}
    </>
  )
}