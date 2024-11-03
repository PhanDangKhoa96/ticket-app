import AddTicketForm from '../components/AddTicketForm';
import TicketFilter from '../components/TicketFilter';
import TicketListing from '../components/TicketListing';

export default function Homepage() {
  return (
    <main className="px-5">
      <div className="container py-10 lg:py-20">
        <h1 className="text-3xl font-medium mb-5">Ticket Listing</h1>
        <TicketFilter />
        <AddTicketForm />
        <TicketListing />
      </div>
    </main>
  );
}
