import { Dispatch, useEffect, useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import {
  CheckCircleIcon,
  UserIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useSearchParams } from 'react-router-dom';
import { QUERY_TASK_PARAM } from '../constants';
import { getTicketById } from '../services/api';
import { Ticket, User } from '@acme/shared-models';
import { getUserName } from '../utilities';

interface IProps {
  openDrawer: boolean;
  setOpenDrawer: Dispatch<boolean>;
  users: User[];
}

export default function TicketDetail({
  openDrawer,
  setOpenDrawer,
  users,
}: IProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const ticketId = searchParams.get(QUERY_TASK_PARAM);

  const ticketAssignedName = ticket?.assigneeId
    ? getUserName(users, ticket?.assigneeId)
    : 'Unassigned';

  useEffect(() => {
    if (!ticketId) {
      setIsLoading(false);
      return;
    }

    const fetchTicket = async () => {
      setIsLoading(true);
      const ticket = await getTicketById(ticketId).finally(() =>
        setIsLoading(false)
      );

      if (ticket) {
        setTicket(ticket);
      }
    };

    fetchTicket();
  }, [searchParams]);

  const closeDrawer = () => {
    const query = searchParams.get(QUERY_TASK_PARAM);
    if (query) {
      searchParams.delete(QUERY_TASK_PARAM);
      setSearchParams(searchParams);
    }
    setOpenDrawer(false);
  };

  return (
    <Dialog open={openDrawer} onClose={closeDrawer} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-base font-semibold text-gray-900">
                      Ticket Detail
                    </DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={closeDrawer}
                        className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative border-t py-5 border-black mt-6 flex-1 px-4 sm:px-6">
                  {isLoading ? (
                    <div className="text-center">Loading ticket...</div>
                  ) : ticket ? (
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-sm mb-1 font-semibold text-gray-600 uppercase">
                          Ticket Name
                        </h2>
                        <p className="text-lg font-bold text-gray-800">
                          {ticket.description}
                        </p>
                      </div>

                      <div>
                        <h2 className="text-sm mb-1 font-semibold text-gray-600 uppercase">
                          Assignee
                        </h2>
                        <div className="flex items-center space-x-2">
                          <UserIcon className="h-5 w-5 text-gray-400" />
                          <span className="text-lg text-gray-800">
                            {ticketAssignedName}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h2 className="text-sm mb-1 font-semibold text-gray-600 uppercase">
                          Status
                        </h2>
                        <div className="flex items-center space-x-2">
                          {ticket.completed ? (
                            <>
                              <CheckCircleIcon className="h-5 w-5 text-green-500" />
                              <span className=" text-green-600">Completed</span>
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="h-5 w-5 text-red-500" />
                              <span className=" text-red-600">
                                Not Completed
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">Ticket not found</div>
                  )}
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
