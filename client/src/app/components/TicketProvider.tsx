import { Ticket, User } from '@acme/shared-models';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { QUERY_STATUS_PARAM } from '../constants';
import {
  assignTicket,
  createTicket,
  getAllTickets,
  getAllUsers,
  markTicketAsComplete,
  markTicketAsIncomplete,
  unassignTicket,
} from '../services/api';

type TicketContextType = {
  tickets: Ticket[];
  users: User[];
  filteredTickets: Ticket[];
  isLoading: boolean;
  editingTicket: Ticket | null;
  statusQuery: string | null;
  addTicket: (ticketName: string) => Promise<void>;
  updateTicket: (updatedTicket: Ticket) => Promise<void>;
  setEditingTicket: (ticket: Ticket | null) => void;
};

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export function TicketProvider({ children }: PropsWithChildren) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState([] as Ticket[]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredTickets, setFilteredTickets] = useState(tickets);

  const statusQuery = searchParams.get(QUERY_STATUS_PARAM);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [userData, ticketData] = await Promise.all([
        getAllUsers(),
        getAllTickets(),
      ]);
      setUsers(userData);
      setTickets(ticketData);
      setFilteredTickets(ticketData);
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addTicket = async (ticketName: string) => {
    if (ticketName.trim()) {
      const ticket: Ticket = {
        id: Date.now(),
        description: ticketName,
        completed: false,
        assigneeId: null,
      };
      try {
        const newRecord = await createTicket(ticket);
        setTickets((prevTickets) => [...prevTickets, newRecord]);
      } catch (error) {
        console.error('Error adding ticket:', error);
      }
    }
  };

  const updateTicket = async (updatedTicket: Ticket) => {
    try {
      if (updatedTicket.completed) {
        await markTicketAsComplete(updatedTicket.id.toString());
      } else {
        await markTicketAsIncomplete(updatedTicket.id.toString());
      }

      if (updatedTicket.assigneeId) {
        await assignTicket(
          updatedTicket.id.toString(),
          updatedTicket.assigneeId
        );
      } else {
        await unassignTicket(updatedTicket.id.toString());
      }

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === updatedTicket.id ? updatedTicket : ticket
        )
      );
      setEditingTicket(null);
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  useEffect(() => {
    if (statusQuery === 'all') {
      searchParams.delete(QUERY_STATUS_PARAM);
      setSearchParams(searchParams);
    }

    const newFilteredTickets =
      statusQuery && statusQuery !== 'all'
        ? tickets.filter((ticket) =>
            statusQuery === 'completed' ? ticket.completed : !ticket.completed
          )
        : tickets;

    setFilteredTickets(newFilteredTickets);
  }, [searchParams, tickets]);

  return (
    <TicketContext.Provider
      value={{
        tickets,
        users,
        filteredTickets,
        isLoading,
        editingTicket,
        statusQuery,
        addTicket,
        updateTicket,
        setEditingTicket,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTicketContext() {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTicketContext must be used within a TicketProvider');
  }
  return context;
}
