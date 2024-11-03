import { Ticket } from '@acme/shared-models';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTicketContext } from './TicketProvider';

const EditingTicketForm = ({ ticket }: { ticket: Ticket }) => {
  const { updateTicket, setEditingTicket, users, editingTicket } =
    useTicketContext();
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold mb-2">{ticket.description}</h2>
      <select
        value={editingTicket?.completed ? 'completed' : 'notCompleted'}
        onChange={(e) =>
          editingTicket &&
          setEditingTicket({
            ...editingTicket,
            completed: e.target.value === 'completed' ? true : false,
          })
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value={'completed'}>Completed</option>
        <option value={'notCompleted'}>Not Completed</option>
      </select>

      <select
        value={editingTicket?.assigneeId?.toString()}
        onChange={(e) =>
          editingTicket &&
          setEditingTicket({
            ...editingTicket,
            assigneeId: Number(e.target.value),
          })
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value={'unassiged'}>Unassigned</option>
        {users.map((user) => {
          return (
            <option value={user.id} key={user.id}>
              {user.name}
            </option>
          );
        })}
      </select>

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => editingTicket && updateTicket(editingTicket)}
          className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <CheckIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => setEditingTicket(null)}
          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default EditingTicketForm;
