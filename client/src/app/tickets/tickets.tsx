import { Ticket } from '@acme/shared-models';

export interface TicketsProps {
  tickets: Ticket[];
}

export function Tickets(props: TicketsProps) {
  return (
    <main>
      <h1>Tickets</h1>
    </main>
  );
}

export default Tickets;
