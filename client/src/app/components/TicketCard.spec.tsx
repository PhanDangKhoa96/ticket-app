import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QUERY_TASK_PARAM } from '../constants';
import TicketCard from './TicketCard';
import { TicketProvider } from './TicketProvider';

// Mock the getUserName function
jest.mock('../utilities', () => ({
  getUserName: jest.fn(() => mockUsers[1].name),
}));
const mockTicket = {
  id: 1,
  description: 'Test Ticket',
  completed: false,
  assigneeId: 2,
};

const mockSetOpenDrawer = jest.fn();

const mockUsers = [
  { id: 1, name: 'User 1' },
  { id: 2, name: 'User 2' },
];

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <TicketProvider>
        <Routes>
          <Route
            path="/"
            element={
              <TicketCard
                ticket={mockTicket}
                setOpenDrawer={mockSetOpenDrawer}
              />
            }
          />
        </Routes>
      </TicketProvider>
    </MemoryRouter>
  );
};

describe('TicketCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.pushState(
      {},
      'Test Title',
      `/?${QUERY_TASK_PARAM}=${mockTicket.id}`
    );
  });

  it('renders ticket information correctly', async () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { name: 'Test Ticket' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByText('Status: Not Completed')).toBeInTheDocument();
    expect(screen.getByText('Assignee: User 2')).toBeInTheDocument();
  });

  it('updates search params and calls setOpenDrawer when view ticket button is clicked', () => {
    renderComponent();

    const viewButton = screen.getByRole('button', { name: /view ticket/i });

    fireEvent.click(viewButton);

    expect(mockSetOpenDrawer).toHaveBeenCalledWith(true);

    const searchParams = new URLSearchParams(window.location.search);
    expect(searchParams.get(QUERY_TASK_PARAM)).toBe(mockTicket.id.toString());
  });

  it('renders completed status correctly', () => {
    const completedTicket = { ...mockTicket, completed: true };
    render(
      <MemoryRouter>
        <TicketProvider>
          <TicketCard
            ticket={completedTicket}
            setOpenDrawer={mockSetOpenDrawer}
          />
        </TicketProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Status: Completed')).toBeInTheDocument();
  });

  it('renders unassigned when there is no assigneeId', () => {
    const unassignedTicket = { ...mockTicket, assigneeId: null };
    render(
      <MemoryRouter>
        <TicketProvider>
          <TicketCard
            ticket={unassignedTicket}
            setOpenDrawer={mockSetOpenDrawer}
          />
        </TicketProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Assignee: Unassigned')).toBeInTheDocument();
  });
});
