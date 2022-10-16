import { useSelector } from 'react-redux';
import { useGetTransferQuery } from '../slices/apiSlice'
import { EditTransfer } from './EditTransfer';

export const EditTransferContainer = () => {
  const transferId = useSelector(state => state.transferStatus.editTargetId);
  const editTargetId = useSelector(state => state.transferStatus.editTargetId);

  const {
    data: transfer,
    isFetching,
    isSuccess
  } = useGetTransferQuery(transferId)

  let content;

  if (isFetching) {
    content = <div>is loading</div>
  } else if (isSuccess) {
    content = <EditTransfer transfer={transfer[0]} />
  }

  return (
    <>
      {editTargetId && <section className="modal">
        {content}
      </section>}
    </>
  )
}