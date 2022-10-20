import { rest } from 'msw';
import original from './data/transfers.json';

let toChange = [...original];

export const requestHandlers = [
  rest.get(`${process.env.REACT_APP_API_BASE_URL}/transfer`, (req, res, ctx) => {
    return res(ctx.json(toChange))
  }),
  rest.get(`${process.env.REACT_APP_API_BASE_URL}/transfer/:transferId`, (req, res, ctx) => {
    const { transferId } = req.params
    const result = toChange.find(transfer => transfer.id = transferId);
    return res(ctx.json([result]))
  }),
  rest.post(`${process.env.REACT_APP_API_BASE_URL}/transfer`, async (req, res, ctx) => {
    let payload = await req.json();
    payload.id = Math.random();
    toChange.push(payload);
    return res(ctx.status(200))
  }),
  rest.put(`${process.env.REACT_APP_API_BASE_URL}/transfer/:transferId`, async (req, res, ctx) => {
    const { transferId } = req.params
    let payload = await req.json();
    payload.id = transferId;
    const index = toChange.findIndex((transfer) => transfer.id === transferId);
    toChange[index] = payload;
    return res(ctx.json([toChange]))
  }),
  rest.delete(`${process.env.REACT_APP_API_BASE_URL}/transfer/:transferId`, (req, res, ctx) => {
    const { transferId } = req.params
    toChange = toChange.filter((transfer) => transfer.id !== transferId);
    return res(ctx.status(200))
  })
];

export const refreshData = () => {
  toChange = [...original];
};
