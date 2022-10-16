import { useSelector } from 'react-redux';
import { useGetTransferQuery } from '../slices/apiSlice'
import { EditTransfer } from './EditTransfer';

// Container components fetch data and rendering the related view component
// usually don’t have any DOM markup of their own
// except for some wrapping divs, and never have any styles.
export const EditTransferContainer = () => {
  const transferId = useSelector(state => state.transferStatus.editTargetId);
  const editTargetId = useSelector(state => state.transferStatus.editTargetId);

  const {
    data: transfer,
    isFetching,
    isSuccess,
    isError
  } = useGetTransferQuery(transferId)

  let content;

  if (isFetching) {
    content = <div>is loading</div>
  } else if (isSuccess) {
    content = <EditTransfer transfer={transfer[0]} />
  } else if (isError) {
    content = <div>Cannot get transfer date</div>
  }

  return (
    <>
      {editTargetId && <section className="modal">
        <div className="modal__dialog card">
          <div className="modal__header">
            <h2>Edit transfer</h2>
          </div>
          {content}
        </div>
      </section>}
    </>
  )
}