import { useSearchParams } from 'react-router-dom';
import { QUERY_STATUS_PARAM } from '../constants';

const TicketFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const statusQuery = searchParams.get(QUERY_STATUS_PARAM);

  const setFilterParam = (value: string) => {
    if (statusQuery) {
      searchParams.delete(QUERY_STATUS_PARAM);
    }
    setSearchParams({ status: value });
  };

  return (
    <div className="flex gap-x-5 items-center mb-5 justify-end">
      <span className="shrink-0">Filter by:</span>
      <select
        defaultValue={statusQuery || 'all'}
        onChange={(e) => {
          setFilterParam(e.target.value);
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value={'all'}>All</option>
        <option value={'completed'}>Completed</option>
        <option value={'notCompleted'}>Not Completed</option>
      </select>
    </div>
  );
};

export default TicketFilter;
