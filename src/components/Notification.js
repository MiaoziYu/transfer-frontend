import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../features/transfers/slices/statusSlice";
import { svg } from '../svg';

const Notification = () => {
  const status = useSelector(state => state.transferStatus.notification.status);
  const message = useSelector(state => state.transferStatus.notification.message);
  const dispatch = useDispatch();

  useEffect(() => {
    if (status && message) {
      setTimeout(() => {
        dispatch(setNotification({
          status: '',
          message: ''
        }));
      }, 2000);
    }
  });

  return (
    <div role="notification" className={`notification ${status}`}>
      {svg.bell} <span>{message}</span>
    </div>
  )
};

export default Notification;
