import { useDispatch } from 'react-redux';
import { toogleBackground } from '../../../helpers';
import { setAddModalVisibility } from '../slices/statusSlice';

export const AddTransferButton = () => {
  const dispatch = useDispatch();

  const onButtonClicked = () => {
    dispatch(setAddModalVisibility(true));
    toogleBackground();
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