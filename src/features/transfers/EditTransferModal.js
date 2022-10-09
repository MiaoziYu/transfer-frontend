import { useSelector } from 'react-redux';
import { useGetTransferQuery } from './slices/apiSlice'
import { EditTransferForm } from './EditTransferForm';

export const EditTransferModal = () => {
  const transferId = useSelector(state => state.transferStatus.editTargetId);

  const {
    data: transfer,
    isFetching,
    isSuccess
  } = useGetTransferQuery(transferId)

  let content;

  if (isFetching) {
    content = <div>is loading</div>
  } else if (isSuccess) {
    content = <EditTransferForm transfer={transfer[0]} />
  }

  return (
    <section>
      <h2>Edit transfer</h2>
      {content}
    </section>
  )
}