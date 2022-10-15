import { useDispatch, useSelector } from 'react-redux';
import { setAddModalVisibility } from '../slices/statusSlice';

export const AddTransferButton = () => {
  const dispatch = useDispatch();
  const isVisible = useSelector(state => state.transferStatus.isAddModalVisible);

  const onButtonClicked = () => {
    dispatch(setAddModalVisibility(true));
  }

  return (
    <>
      {!isVisible && <section>
        <button
          type="button" onClick={onButtonClicked}>
            Add new transfer
        </button>
      </section>}
    </>
  )
}