import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QUERY_TASK_PARAM } from '../constants';
import EditingTicketForm from './EditingTicketForm';
import TicketCard from './TicketCard';
import TicketDetail from './TicketDetail';
import { useTicketContext } from './TicketProvider';

const TicketListing = () => {
  const {
    isLoading,
    filteredTickets,
    editingTicket,
    users,
  } = useTicketContext();
  const [searchParams] = useSearchParams();
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    const query = searchParams.get(QUERY_TASK_PARAM);
    setOpenDrawer(!!query);
  }, [searchParams]);

  if (isLoading) {
    return <div>Loading tickets...</div>;
  }

  if (filteredTickets.length === 0) {
    return <div>No tickets found!</div>;
  }

  return (
    <div>
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <div key={ticket.id} className="bg-white shadow-md rounded-lg p-4">
            {editingTicket && editingTicket.id === ticket.id ? (
              <EditingTicketForm ticket={ticket} />
            ) : (
              <TicketCard ticket={ticket} setOpenDrawer={setOpenDrawer} />
            )}
          </div>
        ))}
      </div>

      <TicketDetail
        users={users}
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
      />
    </div>
  );
};

export default TicketListing;
