import { rest } from 'msw'
import transfersData from './data/transfers.json'

export const requestHandlers = [
  rest.get(`${process.env.REACT_APP_API_BASE_URL}/transfer`, (req, res, ctx) => {
    return res(ctx.json(transfersData), ctx.delay(5))
  }),
  rest.delete(`${process.env.REACT_APP_API_BASE_URL}/transfer/:transferId`, (req, res, ctx) => {
      return res(ctx.status(200))
  })
];