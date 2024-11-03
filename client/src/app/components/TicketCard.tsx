import React, { Dispatch } from 'react';
import { useTicketContext } from './TicketProvider';
import { useSearchParams } from 'react-router-dom';
import { Ticket } from '@acme/shared-models';
import { getUserName } from '../utilities';
import { PencilIcon } from '@heroicons/react/24/outline';
import { QUERY_TASK_PARAM } from '../constants';

const TicketCard = ({
  ticket,
  setOpenDrawer,
}: {
  ticket: Ticket;
  setOpenDrawer: Dispatch<boolean>;
}) => {
  const { setEditingTicket, users } = useTicketContext();
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <>
      <h2 className="text-lg font-semibold mb-2">{ticket.description}</h2>
      <p className="text-sm text-gray-600 mb-1">
        Status: {ticket.completed ? 'Completed' : 'Not Completed'}
      </p>
      <p className="text-sm text-gray-600 mb-4">
        Assignee:{' '}
        {ticket.assigneeId
          ? getUserName(users, ticket.assigneeId)
          : 'Unassigned'}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex justify-end space-x-2">
          <button
            aria-label="Edit ticket"
            onClick={() => {
              setEditingTicket(ticket);
            }}
            className="p-1 shrink-0 text-blue-500 hover:bg-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Edit
          </button>
        </div>

        <button
          onClick={() => {
            searchParams.append(QUERY_TASK_PARAM, ticket.id.toString());
            setSearchParams(searchParams);
            setOpenDrawer(true);
          }}
          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          View ticket
          <span className="sr-only">, {ticket.description}</span>
        </button>
      </div>
    </>
  );
};

export default TicketCard;
