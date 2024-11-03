import { useState } from 'react';
import { useTicketContext } from './TicketProvider';

const AddTicketForm = () => {
  const [newTicket, setNewTicket] = useState('');
  const { addTicket } = useTicketContext();

  return (
    <div className="mb-4 flex">
      <input
        type="text"
        value={newTicket}
        onChange={(e) => setNewTicket(e.target.value)}
        placeholder="Enter new task"
        className="flex-grow mr-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={() => {
          addTicket(newTicket);
          setNewTicket('');
        }}
        className="px-4 py-2 shrink-0 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Add Ticket
      </button>
    </div>
  );
};

export default AddTicketForm;
