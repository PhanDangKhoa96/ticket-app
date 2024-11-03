// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

jest.mock('./src/app/services/api', () => ({
  getAllUsers: jest.fn(),
  getAllTickets: jest.fn(),
  createTicket: jest.fn(),
  markTicketAsComplete: jest.fn(),
  markTicketAsIncomplete: jest.fn(),
  assignTicket: jest.fn(),
  unassignTicket: jest.fn(),
}));
