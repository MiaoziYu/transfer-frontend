import { useGetTransfersQuery } from './slices/apiSlice'
import { TransfersTable } from './TransferTable';

export const TransfersList = (props) => {
  const {
    data: transfers = [],
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetTransfersQuery();

  let content;

  if (isLoading) {
    content = <div>is loading</div>
  } else if (isSuccess) {
    content = (
      <TransfersTable transfers={transfers} />
    )
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }

  return (
    <section>
      <h2>Transfers</h2>
      {content}
    </section>
  )
}