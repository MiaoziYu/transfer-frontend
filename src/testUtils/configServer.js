import { setupServer } from 'msw/node'
import { preloadedState } from './data/preloadedState';
import { renderWithProviders } from './renderWithProviders';
import { requestHandlers, refreshData } from './requestHandlers';

export const configServer = (ui, state = preloadedState) => {
  const server = setupServer(...requestHandlers);

  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  });

  beforeEach(() => {
    refreshData();
    renderWithProviders(ui, state);
  });

  // Reset any runtime request handlers we may add during the tests.
  afterEach(() => {
    server.resetHandlers()
  });

  // Disable API mocking after the tests are done.
  afterAll(() => server.close());

  return server;
};