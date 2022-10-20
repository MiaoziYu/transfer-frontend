import { useGetTransfersQuery } from '../slices/apiSlice'
import { TransfersList } from './TransfersList';

// Container components fetch data and rendering the related view component
// usually don’t have any DOM markup of their own
// except for some wrapping divs, and never have any styles.
export const TransfersListContainer = () => {
  const {
    data: transfers = [],
    isSuccess,
    isError,
    error
  } = useGetTransfersQuery();

  let content;

  if (isSuccess) {
    content = <TransfersList transfers={transfers} />
  } else if (isError) {
    content = (
      <>
        <h2>Cannot fetch transfers from server</h2>
        <div>Status code: {error.originalStatus}</div>
      </>
    )
  }

  return (
    <section>
      {content}
    </section>
  )
}