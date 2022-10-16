import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { screen } from '@testing-library/react'
import { TransfersListContainer } from '../features/transfers/list/TransfersListContainer'
import { renderWithProviders } from './renderWithProviders'

// We use msw to intercept the network request during the test,
// and return the response after 150ms
// when receiving a get request to the `/transfer` endpoint
export const handlers = [
  rest.get('/transfer', (req, res, ctx) => {
    return res(ctx.json(
      {
        "accountHolder": "Max Mustermann",
        "iban": "DE75512108001245126199",
        "amount": 100,
        "date": "2022-07-01T15:55:46.936Z",
        "note": "A new transfer",
        "id": "048a4a03-18ff-4ed4-a239-f6b5bc82b72f"
      },
      {
        "accountHolder": "Max Musterfrau",
        "iban": "DE75512108001245126199",
        "amount": 200,
        "date": "2022-07-02T15:55:46.936Z",
        "note": "A new transfer",
        "id": "4abe1a0d-bc14-48cb-8416-602c0db2ef21"
      }
    ), ctx.delay(150))
  })
]

const server = setupServer(...handlers)

// Enable API mocking before tests.
beforeAll(() => server.listen())

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

test('fetches & receives transfers', async () => {
  //prepare
  renderWithProviders(<TransfersListContainer />)

  //assertion
  expect(await screen.findByText(/Max Mustermann/i)).toBeInTheDocument()
})