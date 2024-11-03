import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TicketProvider, useTicketContext } from './TicketProvider';
import * as api from '../services/api';
import { Ticket, User } from '@acme/shared-models';
import userEvent from '@testing-library/user-event';

const mockUsers: User[] = [
  { id: 1, name: 'User 1' },
  { id: 2, name: 'User 2' },
];

const mockTickets: Ticket[] = [
  { id: 1, description: 'Ticket 1', completed: false, assigneeId: null },
  { id: 2, description: 'Ticket 2', completed: true, assigneeId: 1 },
];

// Test component to consume the context
const TestComponent: React.FC = () => {
  const {
    tickets,
    users,
    filteredTickets,
    isLoading,
    addTicket,
    updateTicket,
  } = useTicketContext();

  return (
    <div>
      <div data-testid="loading">{isLoading.toString()}</div>
      <div data-testid="tickets">{JSON.stringify(tickets)}</div>
      <div data-testid="users">{JSON.stringify(users)}</div>
      <div data-testid="filtered-tickets">
        {JSON.stringify(filteredTickets)}
      </div>
      <button onClick={() => addTicket('New Ticket')}>Add Ticket</button>
      <button
        onClick={() => updateTicket({ ...mockTickets[0], completed: true })}
      >
        Update Ticket
      </button>
    </div>
  );
};

const renderWithProvider = () => {
  return render(
    <MemoryRouter>
      <TicketProvider>
        <Routes>
          <Route path="/" element={<TestComponent />} />
        </Routes>
      </TicketProvider>
    </MemoryRouter>
  );
};

describe('TicketProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);
    (api.getAllTickets as jest.Mock).mockResolvedValue(mockTickets);
  });

  it('fetches users and tickets on mount', async () => {
    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');

      expect(screen.getByTestId('tickets')).toHaveTextContent(
        JSON.stringify(mockTickets)
      );
      expect(screen.getByTestId('users')).toHaveTextContent(
        JSON.stringify(mockUsers)
      );
    });
  });

  it('adds a new ticket', async () => {
    const newTicket: Ticket = {
      id: 3,
      description: 'New Ticket',
      completed: false,
      assigneeId: null,
    };
    (api.createTicket as jest.Mock).mockResolvedValue(newTicket);

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    userEvent.click(screen.getByText('Add Ticket'));

    await waitFor(() => {
      expect(screen.getByTestId('tickets')).toHaveTextContent(
        JSON.stringify([...mockTickets, newTicket])
      );
    });
  });

  it('updates a ticket', async () => {
    const updatedTicket = { ...mockTickets[0], completed: true };

    renderWithProvider();
    await act(async () => {
      await userEvent.click(screen.getByText('Update Ticket'));
    });

    await waitFor(() => {
      expect(screen.getByText('Update Ticket')).toHaveTextContent(
        'Update Ticket'
      );
    });

    await waitFor(() => {
      expect(api.markTicketAsComplete as jest.Mock).toHaveBeenCalledWith(
        updatedTicket.id.toString()
      );
    });
  });

  it('handles API errors', async () => {
    console.log = jest.fn();
    (api.getAllUsers as jest.Mock).mockRejectedValue(new Error('API Error'));
    (api.getAllTickets as jest.Mock).mockRejectedValue(new Error('API Error'));

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(console.log).toHaveBeenCalledWith(
      'Error fetching data:',
      expect.any(Error)
    );
    expect(screen.getByTestId('tickets')).toHaveTextContent('[]');
    expect(screen.getByTestId('users')).toHaveTextContent('[]');
  });
});
