import { Ticket, User } from '@acme/shared-models';

export const getTicketById = async (id: string): Promise<Ticket> => {
  const res = await fetch(`/api/tickets/${id}`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data: Ticket = await res.json();

  return data;
};

export const createTicket = async (ticket: Ticket): Promise<Ticket> => {
  const res = await fetch(`/api/tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ticket),
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
};

export const getAllTickets = async (): Promise<Ticket[]> => {
  const res = await fetch(`/api/tickets`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
};

export const markTicketAsComplete = async (id: string): Promise<void> => {
  const res = await fetch(`/api/tickets/${id}/complete`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
};

export const markTicketAsIncomplete = async (id: string): Promise<void> => {
  const res = await fetch(`/api/tickets/${id}/complete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
};

export const assignTicket = async (
  id: string,
  userId: number
): Promise<void> => {
  const res = await fetch(`/api/tickets/${id}/assign/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
};

export const unassignTicket = async (id: string): Promise<void> => {
  const res = await fetch(`/api/tickets/${id}/unassign`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  const res = await fetch(`/api/users`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
};
