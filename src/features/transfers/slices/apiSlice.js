import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with this baseUrl
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_BASE_URL }),
  tagTypes: ['Transfer'],
  // The "endpoints" represent operations and requests for this server
  endpoints: builder => ({
    getTransfers: builder.query({
      query: () => '/transfer',
      providesTags: ['Transfer']
    }),
    getTransfer: builder.query({
      query: transferId => `/transfer/${transferId}`,
      providesTags: ['Transfer']
    }),
    addNewTransfer: builder.mutation({
      query: payload => ({
        url: '/transfer',
        method: 'POST',
        body: payload
      }),
      invalidatesTags: ['Transfer']
    }),
    editTransfer: builder.mutation({
      query: transfer => ({
        url: `/transfer/${transfer.id}`,
        method: 'PUT',
        body: transfer
      }),
      invalidatesTags: ['Transfer']
    }),
    deleteTransfer: builder.mutation({
      query: transferId => ({
        url: `/transfer/${transferId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Transfer']
    })
  })
})

// Export the auto-generated hooks for transfer endpoint
export const {
  useGetTransfersQuery,
  useGetTransferQuery,
  useAddNewTransferMutation,
  useEditTransferMutation,
  useDeleteTransferMutation
} = apiSlice;