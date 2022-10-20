import { useDispatch } from 'react-redux';
import { togglePageScrolling } from '../../../utils/helpers';
import { setAddModalVisibility } from '../slices/statusSlice';

export const AddTransferButton = () => {
  const dispatch = useDispatch();

  const onButtonClicked = () => {
    // addModalVisibility === true will activate modal
    dispatch(setAddModalVisibility(true));

    // prevent page from scrolling when modal is active
    togglePageScrolling();
  }

  return (
    <button
      type="button"
      onClick={onButtonClicked}
      className="btn-yellow">
        Add transfer
    </button>
  )
}